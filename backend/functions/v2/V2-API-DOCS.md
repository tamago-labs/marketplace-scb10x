# **V2-MARKETPLACE-APIS**

## **ACCOUNTS**

| METHOD | PATH                  | REQUEST_BODY                                                                           | NOTES |
| ------ | --------------------- | -------------------------------------------------------------------------------------- | ----- |
| GET    | /v2/account/{address} | none                                                                                   |       |
| POST   | /v2/account/update    | {message, signature, address, email, description, profile, cover, social, collections} | 1     |

### notes

1. POST /v2/account/update  
   1.1 - This endpoint is configured to handle account creating, and updating.

   1.2 - message, signature, address ARE ALWAYS REQUIRED

   1.3 - email, description ARE REQUIRED when CREATING.

   1.4 - other keys are optional

example request body :

  <pre>
 {
    "message":"???",
    "signature":"???",
    "address": "0x.......",
    "email":"123132@sddfsadf.com",
    "description" : "example description",
    "profile" : "ipfs://bafybeifnerbi7xsp34byxyiylgc6stfghh3iqvg5i2xkoybfusyyw2inma/269.png",
    "cover" : "https://ipfs.io/ipfs/bafybeifnerbi7xsp34byxyiylgc6stfghh3iqvg5i2xkoybfusyyw2inma/269.png",
    "social" : {
        "twitter" : "https://twitter.com/tamagofinance",
        "website" : "tamago.finance"
    },
    "collections" : {
       "neowft" : "https://opensea.io/collection/neowft"
    }
  }
  </pre>

---

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
