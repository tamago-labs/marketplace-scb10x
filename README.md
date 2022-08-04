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

### Ethereum

Contract Name | Contract Address 
--- | ---  
Marketplace | 0x260fC7251fAe677B6254773d347121862336fb9f

### Avalanche

Contract Name | Contract Address 
--- | ---  
Marketplace | 0x7D17d5903eDEdB8597c9343c94FeD74E93589e47

### Polygon

Contract Name | Contract Address 
--- | --- 
Marketplace | 0xd0B14b314B6B983889b68E6EA307BF210156A050

### BNB Chain

Contract Name | Contract Address 
--- | ---  
Marketplace | 0xC8def0BE43D35a247e03EEd09C9afBd5FC866769 

### Kovan Testnet

Contract Name | Contract Address 
--- | ---  
Marketplace | 0x49F74a10855288D2f390E784c349dCD3f44499AC
Mock NFT | 0x48a47587c82E0B21d213D22064433BB67a7a7171

### Mumbai Testnet

Contract Name | Contract Address 
--- | --- 
Marketplace | 0x9286e7a1f66b6f99dB85A345117a330ED5ED79F1
Mock NFT | 0x576430Ecadbd9729B32a4cA9Fed9F38331273924

### Avalanche Fuji Testnet (Chain Id : 43113)

Contract Name | Contract Address 
--- | ---  
Marketplace | 0x9682DaBf26831523B21759A50b0a45832f82DBa3
Mock NFT | 0x61ad3Fe6B44Bfbbcec39c9FaD566538c894b6471
Mock USDC | 0x65e38111d8e2561aDC0E2EA1eeA856E6a43dC892
Mock DAI | 0x553588e084604a2677e10E46ea0a8A8e9D859146

### BNB Smart Chain Testnet (Chain Id : 97)

Contract Name | Contract Address 
--- | ---  
Marketplace | 0x6fdB032668F1F856fbC2e9F5Df348938aFBFBE17
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
