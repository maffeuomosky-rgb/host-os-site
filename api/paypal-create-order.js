import { getOrderByCustomerToken, setPayPalOrder } from '../lib/db.js';
import { hashToken } from '../lib/core.js';
import { assertAllowedOrigin, json, readJson, requirePost } from '../lib/http.js';
import { createPayPalOrder } from '../lib/paypal.js';

export default async function handler(req, res) {
  if (!requirePost(req, res)) return;
  if (!assertAllowedOrigin(req)) return json(res, 403, { error: 'ORIGIN_NOT_ALLOWED' });
  try {
    const body = await readJson(req);
    const order = await getOrderByCustomerToken(body.orderId || '', hashToken(body.customerToken || ''));
    if (!order || order.payment_method !== 'paypal') return json(res, 404, { error: 'ORDER_NOT_FOUND' });
    if (['PAGATO','CONSEGNATO','RIMBORSATO','ANNULLATO'].includes(order.order_status)) return json(res, 409, { error: 'ORDER_NOT_PAYABLE' });

    if (order.paypal_order_id) return json(res, 200, { paypalOrderId: order.paypal_order_id });
    const pp = await createPayPalOrder({
      internalOrderId: order.id,
      amountCents: order.amount_cents,
      currency: order.currency,
      customerName: order.customer_name
    });
    if (!pp?.id) throw new Error('PayPal order id mancante');
    await setPayPalOrder(order.id, pp.id);
    json(res, 200, { paypalOrderId: pp.id });
  } catch (error) {
    console.error('paypal-create-order', error);
    json(res, 502, { error: 'PAYPAL_CREATE_FAILED', message: error.message });
  }
}
