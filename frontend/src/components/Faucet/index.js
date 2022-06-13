import React, { useState, useEffect, useCallback, useMemo } from "react"
import styled, { keyframes } from "styled-components"
import { useWeb3React } from "@web3-react/core"
import { ethers } from "ethers"
import MockERC1155Token from "../../abi/mockERC1155Token.json"
import { MOCK_NFT, MOCK_TOKEN } from "../../constants"
import { resolveNetworkName } from "../../helper"
import ERC20ABI from "../../abi/erc20.json"
import MockNFT from "../../abi/mockNFT.json"

const ListContainer = styled.div`
  display: flex;
  flex-wrap: wrap; 
  justify-content: center;
  border: 1px solid white;
`

const Header = styled.div`
  text-align : center;

  .title {
    font-weight: 600;
    font-size: 32px;
    color: #fff;
  }
`

function blinkingEffect() {
  return keyframes`
	50% {
		opacity: 0;
	}
`
}

const AnimatedComponent = styled.svg`
  animation: ${blinkingEffect} 1s linear infinite;
`

const NFTCard = styled.div` 
  width: 150px; 
  border-radius: 12px;
  padding: 12px; 
  border: 1px solid transparent;
  margin-left: 3px;
  margin-right: 3px;
  margin-bottom: 10px;
  font-size: 12px;
 

  .name {
    color: #fff;
    margin-top: 12px;
    cursor: pointer; 
    :hover {
      text-decoration: underline;
    }
  }

  a {
    
    text-decoration: underline;
    cursor: pointer; 
    :hover {
      text-decoration: underline;
    }
  }

`

const Container = styled.div.attrs(() => ({ className: "container" }))`
  margin-top: 32px;
  padding-bottom: 32px;
  background-color: rgba(38, 38, 38, 0.6);
  border-radius: 24px;
  padding: 20px;
  padding-top: 40px;
  max-width: 800px; 
`


const Link = styled.a`

`

// const MintToken = () => {
//   const { chainId, account, library } = useWeb3React()

//   const [chain, setChain] = useState(42)
//   const [isNFT, setNFT] = useState(true)

//   const onMint = useCallback(async (address, id) => {

//     if (chain !== chainId) {
//       alert("Incorrect chain!")
//       return
//     }

//     try {
//       if (address === "0xf4d331039448182cf140de338177706657df8ce9" || address === "0x65e38111d8e2561aDC0E2EA1eeA856E6a43dC892") {
//         const contract = new ethers.Contract(
//           address,
//           MockNFT,
//           library.getSigner()
//         )
//         await contract.mint()
//       } else {
//         const contract = new ethers.Contract(
//           address,
//           MockERC1155Token,
//           library.getSigner()
//         )
//         await contract.mint(account, id, 1, "0x")
//       }
//     } catch (e) {
//       console.log(`${e.message}`)
//     }

//   }, [chainId, chain, account, library])

//   const onMintERC20 = useCallback(async (symbol) => {

//     if (chain !== chainId) {
//       alert("Incorrect chain!")
//       return
//     }

//     const row = TOKENS.find(item => item.symbol === symbol && item.chainId === chainId)

//     const contract = new ethers.Contract(
//       row.contract,
//       ERC20ABI,
//       library.getSigner()
//     )
//     try {
//       await contract.faucet()
//     } catch (e) {
//       console.log(`${e.message}`)
//     }

//   }, [chainId, chain, account, library])

//   const mocks = useMemo(() => {

//     if (MOCK_NFT[chain]) {
//       return MOCK_NFT[chain].list
//     }
//     return []
//   }, [chain])

//   const tokens = TOKENS.filter(item => item.chainId === chain)

//   const disabled = chain !== chainId

//   return (
//     <Container>
//       <Header>
//         <h5>Testnet Faucet</h5>
//         <p style={{ maxWidth: " 600px", marginLeft: "auto", marginRight: "auto", fontSize: "14px" }}>
//           You can mint mock NFTs for testing purpose on any testnet we supported
//         </p>
//       </Header>
//       <div style={{ display: "flex" }}>
//         <div style={{ marginLeft: "auto", marginRight: "auto" }}>
//           <label>Chain:</label>
//           <select onChange={(e) => {
//             setChain(Number(e.target.value))
//           }}
//             value={chain} style={{ width: "135px" }}>
//             <option value={42}>Kovan</option>
//             <option value={80001}>Mumbai</option>
//           </select>
//           {` `}
//           <label>Token Type:</label>
//           <select onChange={(e) => {
//             setNFT((e.target.value) === "true" ? true : false)
//           }}
//             value={isNFT} style={{ width: "135px" }}>
//             <option value={true}>NFT</option>
//             <option value={false}>ERC-20</option>
//           </select>
//         </div>
//       </div>
//       <ListContainer>
//         {
//           isNFT && mocks.map((nft, index) => (
//             <NFTCard key={`${index}-nft`}>
//               <img src={nft.image} width="100%" height="120px" />
//               <a onClick={() => {
//                 onMint(nft.address, nft.tokenId)
//               }}>
//                 <div className="name text-center">Mint{` `}{nft.name}{` `}#{nft.tokenId}</div>
//               </a>
//             </NFTCard>
//           ))}


//         {!isNFT && tokens.map((token, index) => {
//           return (
//             <NFTCard key={`${index}-token`}>
//               <div style={{ display: "flex", height: "120px", width: "100%", border: "1px solid white" }}>
//                 <div style={{ margin: "auto" }}>
//                   ERC-20
//                 </div>
//               </div>
//               <a onClick={() => onMintERC20(token.symbol)}>
//                 <div className="name text-center">Mint{` `}{token.symbol}</div>
//               </a>
//             </NFTCard>
//           )
//         })

//         }

//       </ListContainer>
//     </Container>
//   )
// }

const Container2 = styled.div.attrs(() => ({ className: "container" }))`

`

const Title = styled.div`
  text-align :center; 
  margin-top: 1rem;
  p {
    font-size: 14px;
    margin-top: 10px;
    max-width: 500px;
    margin-left: auto;
    margin-right: auto;
    
  }
  .title {
    font-weight: 600;
    font-size: 32px;
    color: #fff;
  }
`

const MainPanel = styled.div` 
  max-width: 800px; 
  margin-left: auto;
  margin-right: auto;
  padding: 1rem; 
  border-radius: 24px;
  min-height: 250px;
`

const ButtonGroup = styled.div`
  display: flex; 

  margin-left: auto;
  margin-right: auto;
  `

const Button = styled.div`
  flex: 1;
  border: 1px solid white;
  padding: 10px 20px;
  margin: 5px;
  text-align: center;
  cursor: pointer;
  :hover {
    background: white;
    color: #333;
  }
  ${props => props.active && `
    background: white;
    color: #333;
  
  `}
`

const Label = styled.div` 
  text-align: center;
  margin-top: 5px;
  margin-bottom: 5px; 
  font-size: 14px;
`

const SmallButton = styled.button`
  color: inherit;
  background: transparent;
  border: 1px solid white; 
  padding: 5px 10px; 
  font-size: 12px;
  text-decoration: none; 
   

  :hover {
    color: #333;
    background: white;
    
  }
`

const Faucet = () => {

  const { chainId, account, library } = useWeb3React()

  const [chain, setChain] = useState(42)
  const [isNFT, setNFT] = useState(true)

  const onMint = useCallback(async (address, id) => {

    if (chain !== chainId) {
      alert("Incorrect chain!")
      return
    }

    try {
      if (address === "0xf4d331039448182cf140de338177706657df8ce9" || address === "0x65e38111d8e2561aDC0E2EA1eeA856E6a43dC892") {
        const contract = new ethers.Contract(
          address,
          MockNFT,
          library.getSigner()
        )
        await contract.mint()
      } else {
        const contract = new ethers.Contract(
          address,
          MockERC1155Token,
          library.getSigner()
        )
        await contract.mint(account, id, 1, "0x")
      }
    } catch (e) {
      console.log(`${e.message}`)
    }

  }, [chainId, chain, account, library])

  const onMintERC20 = useCallback(async (symbol) => {

    if (chain !== chainId) {
      alert("Incorrect chain!")
      return
    }

    const row = MOCK_TOKEN.find(item => item.symbol === symbol && item.chainId === chainId)

    const contract = new ethers.Contract(
      row.contract,
      ERC20ABI,
      library.getSigner()
    )
    try {
      await contract.faucet()
    } catch (e) {
      console.log(`${e.message}`)
    }

  }, [chainId, chain, account, library])

  const mocks = useMemo(() => {

    if (MOCK_NFT[chain]) {
      return MOCK_NFT[chain].list
    }
    return []
  }, [chain])

  const tokens = MOCK_TOKEN.filter(item => item.chainId === chain)

  const disabled = chain !== chainId

  return (
    <Container2>

      <Title>
        <div className="title">🏭Faucet</div>
        <p>
          Allows mint mock NFTs and tokens for testing on testnet before taking any action with your real tokens
        </p>
      </Title>

      

      <MainPanel>


        <Label>
          Chain
        </Label>
        <ButtonGroup>
          <Button onClick={() => setChain(42)} active={chain === 42}>
            Kovan
          </Button>
          <Button onClick={() => setChain(80001)} active={chain === 80001}>
            Mumbai
          </Button>
          <Button onClick={() => setChain(97)} active={chain === 97}>
            BNB Testnet
          </Button>
          <Button onClick={() => setChain(43113)} active={chain === 43113}>
            AVAX Fuji
          </Button>
        </ButtonGroup>
        <Label>
          Token Type
        </Label>
        <ButtonGroup>
          <Button onClick={() => setNFT(true)} active={isNFT}>
            NFT
          </Button>
          <Button onClick={() => setNFT(false)} active={!isNFT}>
            ERC-20
          </Button>
        </ButtonGroup>
        <Label>
          Available Tokens
        </Label>
        <ListContainer>
          {
            isNFT && mocks.map((nft, index) => (
              <NFTCard key={`${index}-nft`}>
                <img src={nft.image} width="100%" height="120px" style={{ marginBottom: "10px" }} />

                <div className="text-center">
                  <SmallButton onClick={() => onMint(nft.address, nft.tokenId)}>
                    Mint{` `}{nft.name}{` `}#{nft.tokenId}
                  </SmallButton>
                </div>
              </NFTCard>
            ))}

          {!isNFT && tokens.map((token, index) => {
            return (
              <NFTCard key={`${index}-token`}>
                <div style={{ display: "flex", height: "120px", width: "100%", border: "1px solid white", marginBottom: "10px" }}>
                  <div style={{ margin: "auto" }}>
                    ERC-20
                  </div>
                </div>
                <div className="text-center">
                  <SmallButton onClick={() => onMintERC20(token.symbol)}>
                    Mint{` `}{token.symbol}
                  </SmallButton>
                </div>

              </NFTCard>
            )
          })

          }


        </ListContainer>
        {disabled &&
          (<div style={{ textAlign: "center",  fontWeight: "600", marginTop: "0.5rem" }}>
            Invalid chain!
          </div>)

        }
      </MainPanel>
    </Container2>
  )
}


export default Faucet
