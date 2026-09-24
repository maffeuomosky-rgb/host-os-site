# OS SUITE — Reference Architecture

HOST OS 1.2 è il riferimento tecnico per Seller OS e per i futuri prodotti Sheet Edition.

## Principio

Riutilizzare l'infrastruttura commerciale e di delivery, mantenendo separati prodotto, branding, logica, documentazione e Customer Pack.

## Moduli comuni

1. Sito Vercel
2. Checkout
3. Database PostgreSQL/Neon
4. Stati ordine
5. PayPal link
6. Bonifico
7. Admin protetto
8. Vercel Blob privato
9. Download tokenizzato
10. Resend
11. Health endpoint
12. QA end-to-end

## Flusso standard

Landing → Carrello → Checkout → Ordine → Pagamento → PAGAMENTO_DA_VERIFICARE → Admin conferma → PAGATO/CONSEGNATO → E-mail → Download

## Stati standard

- IN_ATTESA_PAGAMENTO
- PAGAMENTO_DA_VERIFICARE
- PAGATO
- CONSEGNATO
- ANNULLATO
- RIMBORSATO

## Variabili standard

### Core
- PUBLIC_BASE_URL
- SUPPORT_EMAIL

### Prodotto
- PRODUCT_NAME
- PRODUCT_PRICE_CENTS
- PRODUCT_CURRENCY
- PRODUCT_DOWNLOAD_DAYS
- PRODUCT_MAX_DOWNLOADS
- PRODUCT_BLOB_PATHNAME

### Database
- DATABASE_URL

### Pagamenti
- PAYPAL_MODE
- PAYPAL_PAYMENT_URL
- BANK_ACCOUNT_NAME
- BANK_IBAN

### E-mail
- RESEND_API_KEY
- EMAIL_FROM

### Storage
- BLOB_READ_WRITE_TOKEN

### Admin
- ADMIN_SECRET
- SESSION_SECRET
- ADMIN_SESSION_HOURS

## Regole di replica su Seller OS

Da copiare da HOST OS:

- struttura checkout
- macchina a stati ordine
- database e API
- verifica manuale pagamento
- area admin
- storage privato
- download protetto
- e-mail automatiche
- sicurezza
- health check
- metodologia QA

Da mantenere distintivo in Seller OS:

- nome e branding
- UI e asset
- Google Sheet e Apps Script
- dashboard e moduli operativi
- import CSV
- flussi inventario/vendite/spese
- testi commerciali
- documentazione
- Customer Pack
- filename Blob
- template e-mail specifici del prodotto

## Regola sicurezza

Non pubblicare nel repository:

- credenziali
- token
- IBAN o dati sensibili non necessari
- Customer Pack
- link diretto al Google Sheets customer master
- URL di download privati

## Criterio di release

Un prodotto OS SUITE Sheet Edition è pronto solo quando supera:

1. copia Google Sheets da account esterno
2. onboarding iniziale
3. uso delle funzioni principali
4. checkout PayPal
5. checkout bonifico
6. conferma pagamento admin
7. e-mail
8. download
9. reinvio e-mail
10. rigenera link
11. annullamento
12. rimborso + revoca download
13. test desktop/mobile
14. freeze della release

## Dominio

Dopo il completamento di Seller OS, usare un dominio OS SUITE verificato in Resend e mittenti distinti per prodotto senza duplicare l'infrastruttura.
