# SCB10X - May 2022 - Hackatron

## Test

| HTTP Method | path             | RequestBody | Response                                               |
| ----------- | ---------------- | ----------- | ------------------------------------------------------ |
| GET         | /testing         | none        | {"message":"The testing endpoint functions correctly"} |
| GET         | /test/get        | none        | { message: "TESTGETJSON" }                             |
| POST        | /test/createMock | none        | { message: "new collection added to database" }        |

## Orders

| HTTP Method | path            | RequestBody                 | Response                                                |
| ----------- | --------------- | --------------------------- | ------------------------------------------------------- |
| GET         | /orders         | none                        | { "status": "ok", "orders": [{...},{...},{...}]}        |
| GET         | /orders/{id}    | none                        | { "status": "ok", "order": {...}}                       |
| POST        | /orders         | \*required                  | { "status": "ok", "body": {...req.body} , "orderId": 1} |
| POST        | /orders/confirm | {orderId,message,signature} | { "status": "ok", "orderId": 1}                         |
| POST        | /orders/cancel  | {orderId,message,signature} | { "status": "ok", "orderId": 1}                         |
