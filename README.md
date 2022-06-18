# Multi-chain NFT Marketplace

## Introduction

A multi-chain markerplace allows anyone list NFT once and sell to any chain. Supports of ERC-721, ERC-1155 and accepts payment with ERC-721, ERC-1155 and ERC-20 tokens. Currently live on Kovan and Mumbai Testnet and soon available on Polygon and BNB chain.

## Live URL

https://marketplace-10x.tamago.finance

## Modules

The project consists of 4 modules, `/frontend` made by React, `/contracts` with Hardhat, `/backend` with Google Firebase serves as backend API manages order records and `/services` with Node.js contains the scripts to run validator and relayer nodes.



## API

| HTTP Method | path            | RequestBody                 | Response                                                |
| ----------- | --------------- | --------------------------- | ------------------------------------------------------- |
| GET         | /orders         | none                        | { "status": "ok", "orders": [{...},{...},{...}]}        |
| GET         | /orders/{id}    | none                        | { "status": "ok", "order": {...}}                       |
| POST        | /orders         | \*required                  | { "status": "ok", "body": {...req.body} , "orderId": 1} |
| POST        | /orders/confirm | {orderId,message,signature} | { "status": "ok", "orderId": 1}                         |
| POST        | /orders/cancel  | {orderId,message,signature} | { "status": "ok", "orderId": 1}                         |


## Deployment

### Avalanche

Contract Name | Contract Address 
--- | --- 
Gateway | 0x16EE94e3C07B24EbA6067eb9394BA70178aAc4c0
Marketplace | 0x576430Ecadbd9729B32a4cA9Fed9F38331273924

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
Mock NFT | 0x48a47587c82E0B21d213D22064433BB67a7a7171

### Mumbai Testnet

Contract Name | Contract Address 
--- | --- 
Gateway | 0x16EE94e3C07B24EbA6067eb9394BA70178aAc4c0
Marketplace | 0xf2260B00250c772CB64606dBb88d9544F709308C
Mock NFT | 0x576430Ecadbd9729B32a4cA9Fed9F38331273924

### Avalanche Fuji Testnet (Chain Id : 43113)

Contract Name | Contract Address 
--- | --- 
Gateway | 0x16EE94e3C07B24EbA6067eb9394BA70178aAc4c0
Marketplace | 0x576430Ecadbd9729B32a4cA9Fed9F38331273924
Mock NFT | 0x61ad3Fe6B44Bfbbcec39c9FaD566538c894b6471
Mock USDC | 0x65e38111d8e2561aDC0E2EA1eeA856E6a43dC892
Mock DAI | 0x553588e084604a2677e10E46ea0a8A8e9D859146

### BNB Smart Chain Testnet (Chain Id : 97)

Contract Name | Contract Address 
--- | --- 
Gateway | 0x16EE94e3C07B24EbA6067eb9394BA70178aAc4c0
Marketplace | 0x576430Ecadbd9729B32a4cA9Fed9F38331273924
Mock NFT | 0xabA544c167443f3feE33Fb49Ee7b1b49594C25F3
Mock USDC | 0x65e38111d8e2561aDC0E2EA1eeA856E6a43dC892
Mock DAI | 0x553588e084604a2677e10E46ea0a8A8e9D859146

### Offchain Nodes

Type | Address 
--- | --- 
Relayer | 0xf101B7cffF01FFF5D038C8ed38ae98dc45b98343
Validator | 0x361aad4b274cCb5Bcc60316FF8db46C3cc753CCF

## License

MIT © Tamago Finance
