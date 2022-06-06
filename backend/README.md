# SCB10X - May 2022 - Hackathon

## Test

| HTTP Method | path                     | RequestBody | Response                                               |
| ----------- | ------------------------ | ----------- | ------------------------------------------------------ |
| GET         | /testing                 | none        | {"message":"The testing endpoint functions correctly"} |
| GET         | /test/get                | none        | { "message": "TESTGETJSON" }                           |
| GET         | /test/ethers             | none        | {"status":"ok","blocknumber":14834871}                 |
| GET         | /test/moralisNFTMETADATA | none        | {"status":"ok","metadata":{...metadata}}               |
| POST        | /test/createMock         | none        | { message: "new collection added to database" }        |

## Orders


| HTTP Method | path                                    | RequestBody                 | Response                                                |
| ----------- | --------------------------------------- | --------------------------- | ------------------------------------------------------- |
| GET         | /orders                                 | none                        | { "status": "ok", "orders": [{...},{...},{...}]}        |
| GET         | /orders?chain=42,80001                  | none                        | { "status": "ok", "orders": [{...},{...},{...}]}        |
| GET         | /orders/{id}                            | none                        | { "status": "ok", "order": {...}}                       |
| GET         | /orders/collection/{collection_address} | none                        | { "status": "ok", "orders": [{...},{...},{...}]}        |
| GET         | /orders/owner/{owner_address}           | none                        | { "status": "ok", "orders": [{...},{...},{...}]}        |
| POST        | /orders                                 | \*required                  | { "status": "ok", "body": {...req.body} , "orderId": 1} |
| POST        | /orders/confirm                         | {orderId,message,signature} | { "status": "ok", "orderId": 1}                         |
| POST        | /orders/cancel                          | {orderId,message,signature} | { "status": "ok", "orderId": 1}                         |

## Proofs

| HTTP Method | path                | RequestBody                | Response                                         |
| ----------- | ------------------- | -------------------------- | ------------------------------------------------ |
| POST        | /proof/swap/        | {order,chainId,tokenIndex} | { "status": "ok", order,chainId,tokenIndex,proof |
| POST        | /proof/partial-swap | {order,token}              | { "status": "ok", order,token,proof}             |
| POST        | /proof/claim        | {order,account,token}      | { "status": "ok", proof}                         |


## NFTs

| HTTP Method | path                                 | RequestBody | Response                                 | Notes                                  |
| ----------- | ------------------------------------ | ----------- | ---------------------------------------- | -------------------------------------- |
| GET         | /nft/metadata/{address}/{id}/{chain} | none        | {"status":"ok","metadata":{...metadata}} | chainId is in hexadecimal (eg. "0x89") |
