import styled from "styled-components";
import { useWeb3React } from "@web3-react/core"
import { Container } from "reactstrap";
import { OptionsLarge } from "../input"
import { supportedChainIds } from "../../config/connectors";
import { resolveNetworkName, shortAddress } from "../../helper";
import { AssetCard } from "../card";
import useOrder from "../../hooks/useOrder";
import { useEffect, useMemo, useState } from "react";
import { Button, Button2, ToggleButton } from "../../components/button"
// import { Button as Button2 } from "reactstrap"
import { shorterName } from "../../helper"
import { ERC20_TOKENS } from "../../constants";
import Skeleton from "react-loading-skeleton";
import { Options } from "../input"
import NFTCard from "./nftCard"
import Collection from "./collectionCard"

const ButtonGroup = styled.div`
  display: flex;   
  flex-wrap: wrap; 
  justify-content: center;

  button {
      font-size: 10px;
      margin-top: 10px;
      :not(:first-child) {
          margin-left: 10px;
      }
  }
  `

const TypeGroup = styled(ButtonGroup)`
    justify-content: flex-start;
    flex: 1;
    height: 20px;

`

const StyledContainer = styled.div`

`

const Row = styled.div`
  display: flex;
  flex-direction: row;
`

const NetworkPanel = styled.div`
    text-align: center;
    padding: 1rem;
    padding-top: 0rem;
    padding-bottom: 0rem;
`

const Description = styled.p`
    max-width: 700px;
    margin-left: auto;
    margin-right: auto;
    font-size: 14px;
    padding: 1.5rem;
`

const AllOrdersPanel = styled.div`
    display: flex;
    flex-wrap: wrap;  
    padding-top: 20px;
`

const CollectionsPanel = styled.div`
display: flex;
flex-direction: column;
padding-top: 20px;
`

const SearchSection = styled.div`
     max-width: 800px;
     margin-left: auto;
     margin-right: auto;
     text-align: center;
`

const MainSection = styled.div`
  padding: 20px;
  max-width: 1400px;
    margin-left: auto;
    margin-right: auto;
`

const MAX_ITEMS = 16;



const OptionsPanel = styled.div`
    padding: 20px;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    
`

const OptionsRow = styled.div`
    display: flex; 
    flex-direction: row;   
    div {
        font-size: 12px;
        margin: auto;
        ${props => props.disabled && "opacity: 0.6;"}
    }
    label {
        margin-right: 10px;
    }
    :first-child {
        margin-right: 10px;
    }
    
`


const Orders = () => {

    const [chain, setChain] = useState()
    const [showCollection, setShowCollection] = useState(true)
    const [orders, setOrders] = useState([])
    const [collections, setCollections] = useState([])
    const [filter, setFilter] = useState({})

    const [max, setMax] = useState(MAX_ITEMS);

    const { getAllOrders } = useOrder()

    useEffect(() => {
        setTimeout(() => {
            if (localStorage.getItem("chainId")) {
                setChain(Number(localStorage.getItem("chainId")))
            } else {
                setChain(1)
            }
        }, 500)
    }, [])

    useEffect(() => {
        if (chain) {
            setOrders([])
            setFilter({})
            setCollections([])
            setMax(MAX_ITEMS)
            getAllOrders(chain).then(setOrders)
        }

    }, [chain])

    useEffect(() => {
        const collections = orders.reduce((array, item) => {
            if (array.indexOf(item.assetAddress) === -1) {
                array.push(item.assetAddress)
            }
            return array
        }, [])
        setCollections(collections)
    }, [orders])

    const updateChain = (chainId) => {
        setChain(chainId)
        localStorage.setItem("chainId", `${chainId}`)
    }

    const updateShowCollection = (showing) => {
        setShowCollection(showing)
    }

    const filtered = useMemo(() => {

        if (Object.keys(filter).length === 0) {
            return orders
        }

        let output = orders

        if (filter['collection']) {
            const c = collections.find((item, index) => (index + 1) === filter['collection'])
            output = output.filter(item => item.assetAddress.toLowerCase() === c.toLowerCase())
        }

        if (filter['type']) {
            console.log(filter['type'], output)
            output = output.filter(item => (item.tokenType + 1) === filter['type'])
        }

        return output

    }, [orders, collections, filter])

    console.log("c -->", collections)

    return (
        <StyledContainer>

            <SearchSection>
                <NetworkPanel>
                    <ButtonGroup>
                        <ToggleButton onClick={() => updateChain(1)} active={chain === 1}>
                            Ethereum
                        </ToggleButton>
                        <ToggleButton onClick={() => updateChain(137)} active={chain === 137}>
                            Polygon
                        </ToggleButton>
                        <ToggleButton onClick={() => updateChain(56)} active={chain === 56}>
                            BNB
                        </ToggleButton>
                        <ToggleButton onClick={() => updateChain(43114)} active={chain === 43114}>
                            Avalanche
                        </ToggleButton>
                    </ButtonGroup>
                    <ButtonGroup>
                        <ToggleButton onClick={() => updateChain(42)} active={chain === 42}>
                            Kovan
                        </ToggleButton>
                        <ToggleButton onClick={() => updateChain(80001)} active={chain === 80001}>
                            Mumbai
                        </ToggleButton>
                        <ToggleButton onClick={() => updateChain(97)} active={chain === 97}>
                            BNB Testnet
                        </ToggleButton>
                        <ToggleButton onClick={() => updateChain(43113)} active={chain === 43113}>
                            Fuji Testnet
                        </ToggleButton>
                    </ButtonGroup>
                </NetworkPanel>

                {/* <div style={{ fontSize: "12px", padding: "20px", paddingTop: "0px", display: "flex", flexDirection: "row" }}>
                        <div>
                            <Button onClick={() => setShowAll(false)}>
                                Query
                            </Button>
                        </div>
                        <div style={{ marginLeft: "10px" }}>
                            <Button onClick={() => setShowAll(true)}>
                                Show All
                            </Button>
                        </div>
                    </div> */}
            </SearchSection>
            <MainSection>
                <div style={{ display: "flex", flexDirection: "row" }}>
                    <TypeGroup>
                        <ToggleButton onClick={() => updateShowCollection(true)} active={showCollection === true}>
                            Collections
                        </ToggleButton>
                        <ToggleButton onClick={() => updateShowCollection(false)} active={showCollection === false}>
                            Items
                        </ToggleButton>
                    </TypeGroup>
                    <div style={{ flex: 1 }}>
                        <OptionsPanel>
                            <OptionsRow disabled={showCollection === true}>
                                <div>
                                    <label>Collection</label>
                                    <Options
                                        disabled={showCollection === true}
                                        getter={filter['collection']}
                                        setter={(value) => setFilter({ ...filter, collection: value })}
                                        options={[[0, ""]].concat(collections.map((value, index) => {
                                            return [index + 1, shortAddress(value)]
                                        }))}
                                    />
                                </div>
                            </OptionsRow>
                            <OptionsRow disabled={showCollection === true}>
                                <div>
                                    <label>Token Type</label>
                                    <Options
                                        disabled={showCollection === true}
                                        getter={filter['type']}
                                        setter={(value) => setFilter({ ...filter, type: value })}
                                        options={[
                                            [0, ""],
                                            [1, "ERC-20"],
                                            [2, "ERC-721"],
                                            [3, "ERC-1155"]
                                        ]}
                                    />
                                </div>
                            </OptionsRow>
                        </OptionsPanel>
                    </div>

                </div>

                {/* SHOW ORDERS */}
                {!showCollection &&
                    (
                        <>
                            <AllOrdersPanel>

                                {(!orders || orders.length === 0) && <AssetCard />}

                                {(filtered.length > 0) &&
                                    filtered.map((order, index) => {
                                        if (index > max - 1) {
                                            return;
                                        }
                                        return (
                                            <NFTCard key={index} delay={index % MAX_ITEMS} order={order} />
                                        );
                                    })}

                            </AllOrdersPanel>
                            <div style={{ padding: "20px", marginTop: "1rem", textAlign: "center" }}>
                                {orders.length > max && (
                                    <Button onClick={() => setMax(max + 8)}>More...</Button>
                                )}
                            </div>
                        </>
                    )
                }
                {/* SHOW COLLECTIONS */}
                {showCollection && (
                    <>
                        <CollectionsPanel>
                            {(!collections || collections.length === 0) && <Collection orders={[]} />}

                            {collections.map((collectionAddress, index) => {
                                const collectionOrders = orders.filter(item => item.assetAddress === collectionAddress)
                                return (
                                    <Collection
                                        delay={index}
                                        orders={collectionOrders}
                                    >
                                        {collectionAddress}
                                    </Collection>
                                )
                            })
                            }
                        </CollectionsPanel>
                    </>
                )

                }
            </MainSection>
        </StyledContainer>
    )
}

export default Orders
