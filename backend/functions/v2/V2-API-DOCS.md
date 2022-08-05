# **V2-MARKETPLACE-APIS**

## **COLLECTIONS**

| METHOD | PATH                                       | REQUEST_BODY | NOTES |
| ------ | ------------------------------------------ | ------------ | ----- |
| GET    | /v2/collection/{chainId}/{contractAddress} | none         |       |
| GET    | /v2/collections/{chainId}                  | none         |       |

### notes

- The floorprice(lowestPrice) of each collection returned in the response object is cached and is set to expire every hour. Then it would be subjected to recalculation.

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

- This endpoint make a request to moralis API for updating a token's metadata in moralisDB. It also updates the database in the backend.
- This endpoint needed to be call twice with wait time in between.(Will find a way to manage this soon.)

---
