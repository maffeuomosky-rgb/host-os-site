import { getOrderByCustomerToken, markPaid } from '../lib/db.js';
import { hashToken } from '../lib/core.js';
import { deliverOrder } from '../lib/delivery.js';
import { assertAllowedOrigin, json, publicBaseUrl, readJson, requirePost } from '../lib/http.js';
import { captureAndValidate } from '../lib/paypal.js';

export default async function handler(req, res) {
  if (!requirePost(req, res)) return;
  if (!assertAllowedOrigin(req)) return json(res, 403, { error: 'ORIGIN_NOT_ALLOWED' });
  try {
    const body = await readJson(req);
    const order = await getOrderByCustomerToken(body.orderId || '', hashToken(body.customerToken || ''));
    if (!order || order.payment_method !== 'paypal') return json(res, 404, { error: 'ORDER_NOT_FOUND' });
    if (!order.paypal_order_id || order.paypal_order_id !== body.paypalOrderId) return json(res, 409, { error: 'PAYPAL_ORDER_MISMATCH' });
    if (order.order_status === 'CONSEGNATO') return json(res, 200, { ok: true, status: order.order_status, alreadyProcessed: true });

    const verified = await captureAndValidate({
      paypalOrderId: order.paypal_order_id,
      amountCents: order.amount_cents,
      currency: order.currency
    });
    const paid = await markPaid(order.id, verified.capture.id || null);
    const delivery = await deliverOrder(paid, publicBaseUrl(req));
    json(res, 200, {
      ok: true,
      status: delivery.ok ? 'CONSEGNATO' : 'PAGATO',
      deliveryOk: delivery.ok,
      deliveryError: delivery.ok ? null : delivery.error
    });
  } catch (error) {
    console.error('paypal-capture', error);
    json(res, 502, { error: 'PAYPAL_CAPTURE_FAILED', message: error.message });
  }
}
