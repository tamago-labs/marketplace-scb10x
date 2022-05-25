# Multi-chain NFT Marketplace
A multi-chain marketplace MVP 


## API

| HTTP Method | path            | RequestBody                 | Response                                                |
| ----------- | --------------- | --------------------------- | ------------------------------------------------------- |
| GET         | /orders         | none                        | { "status": "ok", "orders": [{...},{...},{...}]}        |
| GET         | /orders/{id}    | none                        | { "status": "ok", "order": {...}}                       |
| POST        | /orders         | \*required                  | { "status": "ok", "body": {...req.body} , "orderId": 1} |
| POST        | /orders/confirm | {orderId,message,signature} | { "status": "ok", "orderId": 1}                         |
| POST        | /orders/cancel  | {orderId,message,signature} | { "status": "ok", "orderId": 1}                         |


## Deployment

### Polygon

Contract Name | Contract Address 
--- | --- 
Gateway | 0x41b42033cb4fA44870827A190a70775F8DD0586F
Marketplace | 0x6d2Ef00BDcdec6139079A9887C5a0549111215Ea

### BNB Chain

Contract Name | Contract Address 
--- | --- 
Gateway | 0x836E41FA979A4BA57d6F0021e6ba5388103153f9
Marketplace | 0x0d249716de3bE97a865Ff386Aa8A42428CB97347 

### Kovan Testnet

Contract Name | Contract Address 
--- | --- 
Gateway | 0x88CFE41a3083652216f0974136198A70EA847261
Marketplace | 0xBa9c7eC462dB716E6F79B7D58a38D0b5E5f79141
Mock NFT | 0x0e627EdbBF37785FE8284ff46fD42FD5f51d07ce

### Mumbai Testnet

Contract Name | Contract Address 
--- | --- 
Gateway | 0x16EE94e3C07B24EbA6067eb9394BA70178aAc4c0
Marketplace | 0xf2260B00250c772CB64606dBb88d9544F709308C
Mock NFT | 0x576430Ecadbd9729B32a4cA9Fed9F38331273924
