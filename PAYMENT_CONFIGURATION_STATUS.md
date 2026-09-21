# HOST OS 1.3.2 — Payment configuration status

Payment method code is ready for production configuration through Vercel Environment Variables.

Configured design:
- PayPal: public PayPal.Me base URL via `PAYPAL_PAYMENT_URL`; HOST OS appends the current product amount and currency automatically
- Bank transfer: beneficiary and IBAN via server-side environment variables
- Customer never receives the product until the order is manually confirmed in the admin area
- After confirmation, delivery token generation and protected download remain automatic

Sensitive payment values are intentionally not stored in this GitHub/Vercel deploy package.
