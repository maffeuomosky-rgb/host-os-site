# HOST OS 1.3.0 — Configurazione checkout finale

Questa è la configurazione della versione commerciale corrente

## Flusso attivo

Landing → Carrello → Checkout → Ordine → PayPal link oppure Bonifico → `PAGAMENTO_DA_VERIFICARE` → verifica manuale admin → `Conferma pagamento` → e-mail automatica → download protetto

La verifica del denaro rimane manuale. Tutto ciò che viene dopo la conferma è automatizzato

## 1. Variabili ambiente

Configura in Vercel → Project → Settings → Environment Variables

```env
PUBLIC_BASE_URL=https://tuo-dominio.it
SUPPORT_EMAIL=support@tuo-dominio.it

PRODUCT_NAME=HOST OS 1.2
PRODUCT_PRICE_CENTS=4900
PRODUCT_CURRENCY=EUR
PRODUCT_DOWNLOAD_DAYS=7
PRODUCT_MAX_DOWNLOADS=5

DATABASE_URL=postgresql://...

PAYPAL_MODE=link
PAYPAL_PAYMENT_URL=https://...

BANK_ACCOUNT_NAME=...
BANK_IBAN=...

RESEND_API_KEY=...
EMAIL_FROM=HOST OS <support@tuo-dominio.it>

BLOB_READ_WRITE_TOKEN=...
PRODUCT_BLOB_PATHNAME=products/HOST_OS_1.2_CUSTOMER_PACK_FINAL.zip

ADMIN_SECRET=...
SESSION_SECRET=...
ADMIN_SESSION_HOURS=8
```

Non inserire segreti direttamente nei file del repository

## 2. Database

Usa PostgreSQL compatibile con `DATABASE_URL`, ad esempio Neon. Le tabelle vengono create automaticamente al primo utilizzo

Tabelle principali

- `host_orders`
- `host_webhook_events`

## 3. PayPal attuale

La modalità corrente è

`PAYPAL_MODE=link`

Inserisci il link pubblico nel valore

`PAYPAL_PAYMENT_URL`

Il cliente apre PayPal dal checkout, paga e poi preme `Ho effettuato il pagamento PayPal`

Questa azione non consegna il prodotto. L’ordine passa a `PAGAMENTO_DA_VERIFICARE`

Tu controlli realmente l’incasso su PayPal e solo dopo premi `Conferma pagamento` in `/admin.html`

Gli endpoint PayPal API rimangono nel progetto esclusivamente per un futuro upgrade

## 4. Bonifico

Configura

- `BANK_ACCOUNT_NAME`
- `BANK_IBAN`

HOST OS crea automaticamente una causale del tipo

`HOST OS · HOS-YYMMDD-XXXXXXXX`

Il cliente segnala il bonifico ma la consegna parte solo dopo la tua conferma dal pannello admin

## 5. Customer Pack privato

Il file da consegnare è

`HOST_OS_1.2_CUSTOMER_PACK_FINAL.zip`

Non inserirlo in `assets/` e non pubblicarlo nel repository

Per Vercel Blob privato

1. crea uno store Blob Private
2. collega lo store al progetto
3. ottieni `BLOB_READ_WRITE_TOKEN`
4. esegui dalla root

```bash
npm install
BLOB_READ_WRITE_TOKEN="..." node scripts/upload-product.mjs "/percorso/HOST_OS_1.2_CUSTOMER_PACK_FINAL.zip"
```

5. imposta `PRODUCT_BLOB_PATHNAME` con il pathname restituito

## 6. E-mail

Configura Resend con

- `RESEND_API_KEY`
- `EMAIL_FROM`
- `SUPPORT_EMAIL`

Il sistema invia due tipi di e-mail

1. conferma ordine con link alla pagina stato, se il provider e-mail è già configurato
2. consegna finale con link protetto dopo la conferma del pagamento

Se la mail finale fallisce, l’ordine resta pagato e il cliente può comunque scaricare HOST OS dalla propria pagina ordine quando il download è stato generato

## 7. Download protetto

Il prodotto non è pubblico

La consegna finale usa

- link e-mail con token casuale
- pagina ordine autenticata dal token cliente
- scadenza predefinita 7 giorni
- massimo 5 download

Il pannello admin permette di rigenerare il link e reinviare l’e-mail

## 8. Admin

Apri

`/admin.html`

Configura due valori diversi e lunghi

- `ADMIN_SECRET`
- `SESSION_SECRET`

Azioni disponibili

- Conferma pagamento
- Reinvia e-mail di consegna
- Rigenera link download e copialo
- Annulla ordine
- Segna rimborsato

`Segna rimborsato` aggiorna il registro e revoca i download. Il rimborso finanziario va eseguito separatamente nel metodo di pagamento

## 9. Controllo prima del lancio

Visita

`/api/health`

Devono risultare configurati database, PayPal, bonifico, e-mail, prodotto e admin

Poi esegui due test completi

### PayPal

Checkout → PayPal → Ho effettuato il pagamento → Admin → Conferma → E-mail → Pagina ordine → Download

### Bonifico

Checkout → dati bonifico → Ho effettuato il bonifico → Admin → Conferma → E-mail → Pagina ordine → Download

## 10. Endpoint principali

- `GET /api/config`
- `POST /api/orders`
- `GET /api/order-status`
- `POST /api/paypal-link-notify`
- `POST /api/bank-notify`
- `GET /api/download`
- `GET /api/order-download`
- `POST /api/admin-login`
- `GET /api/admin-session`
- `GET /api/admin-orders`
- `POST /api/admin-action`
- `GET /api/health`

## 11. Sicurezza

- Customer Pack fuori dagli asset pubblici
- token download memorizzato solo come hash
- scadenza e limite download
- pagina ordine protetta da customer token
- cookie admin HttpOnly/Secure/SameSite
- CSRF sulle azioni admin
- query SQL parametrizzate
- rate limit best-effort su creazione ordine/login
- controllo Origin sul checkout

## 12. Passaggio futuro a PayPal API

Quando vorrai automatizzare anche la verifica PayPal puoi impostare `PAYPAL_MODE=api` e configurare Client ID, Secret e Webhook ID già supportati dal progetto


## Stato configurazione pagamenti 1.3.1
Il link PayPal pubblico, il beneficiario del bonifico e l’IBAN sono stati ricevuti e predisposti nella configurazione ambiente. Prima del deploy di produzione copiare i valori di `.env.example` nelle Environment Variables del progetto Vercel.
