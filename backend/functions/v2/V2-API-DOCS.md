# **V2-MARKETPLACE-APIS**

## **COLLECTIONS**

| METHOD | PATH                                       | REQUEST_BODY | NOTES |
| ------ | ------------------------------------------ | ------------ | ----- |
| GET    | /v2/collection/{chainId}/{contractAddress} | none         |       |
| GET    | /v2/collections/{chainId}                  | none         |       |

---

## **ORDERS**

| METHOD | PATH                 | REQUEST_BODY | NOTES |
| ------ | -------------------- | ------------ | ----- |
| GET    | /v2/orders/          | none         |       |
| GET    | /v2/orders/{chainId} | none         |       |

---

## **NFTS**

| METHOD | PATH                                                | REQUEST_BODY | NOTES |
| ------ | --------------------------------------------------- | ------------ | ----- |
| GET    | /v2/nft/refresh/{chain}/{contractAddress}/{tokenId} | none         | 1.    |

### notes

1. This endpoint make a request to moralis for updating a token's metadata. It also updates the database in the backend.

---
