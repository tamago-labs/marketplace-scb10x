Link to v2 Docs : https://github.com/tamago-finance/marketplace-scb10x/blob/main/backend/functions/v2/V2-API-DOCS.md

# MARKETPLACE-APIS

## Accounts

| HTTP Method | path               | RequestBody                                     | Response                    | Notes         |
| ----------- | ------------------ | ----------------------------------------------- | --------------------------- | ------------- |
| GET         | /account/{address} | none                                            | { "status": "ok", account } |               |
| POST        | /account/          | { address, email, nickname,message, signature } | { "status": "ok", address } | See Notes \*5 |

---

## Admins

| HTTP Method | path                       | RequestBody | Response                    | Notes                                                         |
| ----------- | -------------------------- | ----------- | --------------------------- | ------------------------------------------------------------- |
| GET         | //admin/is-admin/{address} | none        | { "status": "ok", isAdmin } | returns boolean type data if the user is whitelisted as admin |

---

## Collections

| HTTP Method | path                               | RequestBody                                                                                                                                    | Response                                                                                    | Notes              |
| ----------- | ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- | ------------------ |
| GET         | /collections?chain=80001,42        | none                                                                                                                                           | { "status": "ok", collections: [{...},{...},{...}],totalCount }                             | See Notes \*3      |
| GET         | /collections/{address}/{chainId}   | none                                                                                                                                           | { "status": "ok", collection : {...collection, ownerAddress} }                              |                    |
| GET         | /collections/search/?query={query} | none                                                                                                                                           | { "status": "ok", collections: [{...},{...},{...}] }                                        |                    |
| POST        | /collections/update                | { address, chainId, message, signature, collectionName, slug, description, websiteLink, discordLink, instagramLink, mediumLink, telegramLink } | 201 { status: "ok", {updated fields} } <br> **OR** 200 { status: "ok", {created document} } | See Notes \*6      |
| POST        | /collections/ban                   | {chainId, address, message, signature}                                                                                                         | { status: "ok", message: "collection banned" }                                              | See Notes \*5 ,\*8 |
| POST        | /collections/un-ban                | {chainId, address, message, signature}                                                                                                         | { status: "ok", message: "collection unbanned" }                                            | See Notes \*5 ,\*8 |

---

## Disputes

| HTTP Method | path                        | RequestBody                                                     | Response                                          | Notes         |
| ----------- | --------------------------- | --------------------------------------------------------------- | ------------------------------------------------- | ------------- |
| GET         | /disputes                   | none                                                            | { "status": "ok", disputes: [{...},{...},{...}] } |               |
| GET         | /disputes/address/{address} | none                                                            | { "status": "ok", disputes: [{...},{...},{...}] } |               |
| GET         | /disputes/{id}              | none                                                            | { "status": "ok", dispute }                       |               |
| POST        | /disputes/                  | {email, address, orderLink, type, comments, message, signature} | { "status": "ok", body: req.body, disputeId }     | See Notes \*5 |
| POST        | /disputes/update/{id}       | {resolved, adminComment, message, signature}                    | { "status": "ok", updated }                       | See Notes \*5 |

---

## NFTs

| HTTP Method | path                                 | RequestBody | Response                                 | Notes                                  |
| ----------- | ------------------------------------ | ----------- | ---------------------------------------- | -------------------------------------- |
| GET         | /nft/metadata/{address}/{id}/{chain} | none        | {"status":"ok","metadata":{...metadata}} | chainId is in hexadecimal (eg. "0x89") |

---

## Orders

| HTTP Method | path                                    | RequestBody                 | Response                                                             | Notes             |
| ----------- | --------------------------------------- | --------------------------- | -------------------------------------------------------------------- | ----------------- |
| GET         | /orders                                 | none                        | { "status": "ok", "orders": [{...},{...},{...}],"totalCount":number} |                   |
| GET         | /orders?chain=42&limit=20&offset=10     | none                        | { "status": "ok", "orders": [{...},{...},{...}],"totalCount":number} | See Notes \*1     |
| GET         | /orders/{id}                            | none                        | { "status": "ok", "order": {...}}                                    |                   |
| GET         | /orders/collection/{collection_address} | none                        | { "status": "ok", "orders": [{...},{...},{...}]}                     |                   |
| GET         | /orders/owner/{owner_address}           | none                        | { "status": "ok", "orders": [{...},{...},{...}]}                     |                   |
| POST        | /orders                                 | \*required                  | { "status": "ok", "body": {...req.body} , "orderId": 1}              |                   |
| POST        | /orders/confirm                         | {orderId,message,signature} | { "status": "ok", "orderId": 1}                                      | See Notes \*5     |
| POST        | /orders/cancel                          | {orderId,message,signature} | { "status": "ok", "orderId": 1}                                      | See Notes \*5,\*7 |

---

## Proofs

| HTTP Method | path                      | RequestBody                | Response                                          |
| ----------- | ------------------------- | -------------------------- | ------------------------------------------------- |
| POST        | /proof/swap               | {order,chainId,tokenIndex} | { "status": "ok", order,chainId,tokenIndex,proof} |
| POST        | /proof/partial-swap       | {order,token}              | { "status": "ok", order,token,proof}              |
| POST        | /proof/claim              | {order,account,token}      | { "status": "ok", order,account,proof}            |
| GET         | /proof/relay-messages     | none                       | { "status": "ok", messages}                       |
| GET         | /proof/validator-messages | none                       | { "status": "ok", claims}                         |

---

## Tests

| HTTP Method | path                     | RequestBody | Response                                               |
| ----------- | ------------------------ | ----------- | ------------------------------------------------------ |
| GET         | /testing                 | none        | {"message":"The testing endpoint functions correctly"} |
| GET         | /test/get                | none        | { "message": "TESTGETJSON" }                           |
| GET         | /test/ethers             | none        | {"status":"ok","blocknumber":14834871}                 |
| GET         | /test/moralisNFTMETADATA | none        | {"status":"ok","metadata":{...metadata}}               |

---

## Users

| HTTP Method | path             | RequestBody | Response                             | Notes         |
| ----------- | ---------------- | ----------- | ------------------------------------ | ------------- |
| GET         | /users/          | none        | { "status": "ok", users,totalCount } | See Notes \*4 |
| GET         | /users/{address} | none        | { "status": "ok", user }             |               |

---

### Notes

Notes \*1 :<br>

- all queries are optional
- default values : limit:500 (this will soon be changed to a lower number), offset: 0

Notes \*2 :<br>

- this API endpoint for admin to manage and keep track of disputes

Notes \*3 :<br>

- **chain** is required in query params, multiple chains can be passed as argument separated by **comma**
- this endpoint supports pagination with **offsets** and **limits**

Notes \*4 :<br>

- this endpoint supports pagination with **offset** and **limit**. eg. "/users?limit=100"

Notes \*5 :<br>

- this endpoint requires **message** and **signature** to recover address in backend server
- email and nickname are optional parameters but at least one of them are required

Notes \*6 :<br>

- req.body must contain address(string),and chainId(number). The other keys **collectionName**, **slug**, **description**, **websiteLink**, **discordLink**, **instagramLink**, **mediumLink**, **telegramLink** are optional
- **slugs** can only contain lowercase letters, numbers, and hyphens. Hyphens can not be adjacent
- **slugs** needs to be at least 3 characters
- users **cannot use wallet address as slugs**. This is done to prevent future technical difficulties
- **slugs** must be unique
- **websiteLink**, **discordLink**, **instagramLink**, **mediumLink**, **telegramLink** should be in proper URL format
- this endpoint creates new document in the collections database if **address** and **chainId** does **not match** existing entries and respond with status code **201** upon successful operation
- if **address** and **chainId** matches with existing entries in the database, the new data is then **merged** into existing document and respond with status code **200** upon successful operation
- message and signature are required to authorize data update
- the database keeps track of the owner address / dev address that last updated the NFT collection

Notes \*7 :<br>

- this endpoint is currently not being used by the frontend, it is disabled to avoid potential bugs.

Notes \*8 :<br>

- this endpoint is intended for admin uses only

#### Development Started During SCB10X - MAY 2022 - METATHON (when we made new cool friends!)
