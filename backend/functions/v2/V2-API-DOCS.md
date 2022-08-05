# **V2-MARKETPLACE-APIS**

## **COLLECTIONS**

| METHOD | PATH                                       | REQUEST_BODY | NOTES |
| ------ | ------------------------------------------ | ------------ | ----- |
| GET    | /v2/collection/{chainId}/{contractAddress} | none         | 1     |
| GET    | /v2/collections/{chainId}                  | none         | 1     |

### notes

1. The floorprice(lowestPrice) of each collection(s) returned in the response object is cached and is set to expire every hour. Then it would be subjected to recalculation on the first API call after it expires.

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
| GET    | /v2/nft/refresh/{chain}/{contractAddress}/{tokenId} | none         | 1, 2  |

### notes

1. This endpoint make a request to moralis API for updating a token's metadata in moralisDB. It also updates the database in the backend.
2. This endpoint needed to be call twice with wait time in between.

---
