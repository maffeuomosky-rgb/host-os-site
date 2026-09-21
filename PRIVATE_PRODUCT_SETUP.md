# File cliente NON incluso nel sito pubblico

Usare il Customer Pack definitivo:

`HOST_OS_1.2_CUSTOMER_PACK_FINAL.zip`

Il file è intenzionalmente escluso da questa ZIP del sito per evitare che venga pubblicato accidentalmente su GitHub/Vercel come asset statico.

Per la produzione caricarlo in uno store Vercel Blob **Private** usando `scripts/upload-product.mjs` e configurare `PRODUCT_BLOB_PATHNAME`.
