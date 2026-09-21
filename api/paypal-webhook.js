import { getOrderByPayPalId, markPaid, recordWebhookEvent, setOrderState } from '../lib/db.js';
import { validateWebhookCapture, ORDER_STATES } from '../lib/core.js';
import { deliverOrder } from '../lib/delivery.js';
import { json, publicBaseUrl, readJson, requirePost } from '../lib/http.js';
import { captureAndValidate, verifyPayPalWebhook } from '../lib/paypal.js';

function relatedOrderId(resource) {
  return resource?.supplementary_data?.related_ids?.order_id || resource?.id || '';
}

export default async function handler(req, res) {
  if (!requirePost(req, res)) return;
  try {
    const event = await readJson(req);
    const verified = await verifyPayPalWebhook(req.headers, event);
    if (!verified) return json(res, 400, { error: 'INVALID_WEBHOOK_SIGNATURE' });
    if (!event?.id || !event?.event_type) return json(res, 400, { error: 'INVALID_EVENT' });
    const first = await recordWebhookEvent(event.id, event.event_type);
    if (!first) return json(res, 200, { ok: true, duplicate: true });

    const type = event.event_type;
    const resource = event.resource || {};

    if (type === 'CHECKOUT.ORDER.APPROVED') {
      const order = await getOrderByPayPalId(resource.id);
      if (order && !['PAGATO','CONSEGNATO','ANNULLATO','RIMBORSATO'].includes(order.order_status)) {
        const result = await captureAndValidate({ paypalOrderId: resource.id, amountCents: order.amount_cents, currency: order.currency });
        const paid = await markPaid(order.id, result.capture.id || null);
        await deliverOrder(paid, publicBaseUrl(req));
      }
    } else if (type === 'PAYMENT.CAPTURE.COMPLETED') {
      const paypalOrderId = relatedOrderId(resource);
      const order = await getOrderByPayPalId(paypalOrderId);
      if (order && !['PAGATO','CONSEGNATO','ANNULLATO','RIMBORSATO'].includes(order.order_status)) {
        const valid = validateWebhookCapture(resource, order.amount_cents, order.currency);
        if (!valid.ok) throw new Error(`Webhook capture non valido: ${valid.reason}`);
        const paid = await markPaid(order.id, resource.id || null);
        await deliverOrder(paid, publicBaseUrl(req));
      }
    } else if (type === 'PAYMENT.CAPTURE.REFUNDED') {
      const paypalOrderId = relatedOrderId(resource);
      const order = await getOrderByPayPalId(paypalOrderId);
      if (order) await setOrderState(order.id, ORDER_STATES.REFUNDED);
    }

    json(res, 200, { ok: true });
  } catch (error) {
    console.error('paypal-webhook', error);
    json(res, 500, { error: 'WEBHOOK_PROCESSING_FAILED' });
  }
}
