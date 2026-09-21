# HOST OS 1.3 — CHECKOUT FINAL

Versione completa del sito HOST OS con carrello, checkout PayPal/bonifico, ordini, verifica manuale dei pagamenti, consegna automatizzata e download protetto.

## Flusso
Landing → Carrello → Checkout → Creazione ordine → PayPal o Bonifico → Pagamento da verificare → Admin conferma → Email automatica → Download protetto

## Consegna
- link e-mail personale dopo conferma pagamento
- download disponibile anche dalla pagina ordine
- validità predefinita 7 giorni
- massimo 5 download
- Customer Pack mantenuto fuori dagli asset pubblici

## Admin
`/admin.html` permette di confermare pagamenti manuali, reinviare l’e-mail, rigenerare un link protetto, annullare e segnare rimborsati gli ordini.

## Configurazione
Vedi `README_SETUP_CHECKOUT.md` e `.env.example`. Nessuna credenziale reale è inclusa nel pacchetto.
