# HOST OS 1.2 — Production Master

Versione commerciale congelata di HOST OS 1.2 con sito, checkout, ordini, verifica manuale dei pagamenti, consegna automatizzata e download protetto.

## Flusso validato

Landing → Carrello → Checkout → Creazione ordine → PayPal link o Bonifico → PAGAMENTO_DA_VERIFICARE → Admin conferma → E-mail automatica → Download protetto

## Stato release

- Google Sheets customer master validato
- Customer Pack privato validato
- Checkout PayPal link validato
- Checkout bonifico validato
- Database ordini validato
- Area admin validata
- Download protetto validato
- Reinvia e-mail validato
- Rigenera link validato
- Annullamento validato
- Rimborso + revoca download validati
- Health endpoint: tutti i moduli configurati

## Consegna

- link personale dopo conferma pagamento
- download disponibile anche dalla pagina ordine
- validità predefinita 7 giorni
- massimo 5 download
- Customer Pack mantenuto fuori dagli asset pubblici
- link Google Sheets /copy mantenuto nel Customer Pack e non pubblicato nel repository

## E-mail

Resend è configurato e testato.

Per l'invio in produzione verso destinatari arbitrari serve un dominio mittente verificato. Fino a quel momento il sender di test Resend va usato solo per collaudo.

## Admin

`/admin.html` permette di:

- confermare pagamenti manuali
- reinviare l'e-mail
- rigenerare un link protetto
- annullare ordini
- segnare ordini rimborsati e revocare il download

## Documentazione

- `README_SETUP_CHECKOUT.md` — configurazione tecnica
- `docs/OS_SUITE_REFERENCE_ARCHITECTURE.md` — blueprint da riutilizzare su Seller OS e futuri prodotti

Nessuna credenziale reale o link diretto al customer master deve essere inserito nel repository pubblico.
