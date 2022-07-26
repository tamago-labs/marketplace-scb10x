import styled from "styled-components";
import { useWeb3React } from "@web3-react/core";
import { Container } from "reactstrap";
import { OptionsLarge } from "../input";
import { supportedChainIds } from "../../config/connectors";
import { resolveNetworkName, shortAddress } from "../../helper";
import { AssetCard } from "../card";
import useOrder from "../../hooks/useOrder";
import { useEffect, useMemo, useState } from "react";
import { Button, Button2, ToggleButton } from "../../components/button"
import { Col } from "reactstrap"
import { shorterName } from "../../helper"
import { ERC20_TOKENS } from "../../constants";
import Skeleton from "react-loading-skeleton";
import { Options } from "../input"
import NFTCard from "../nftCard"
import Collection from "./collectionCard"
import { NETWORK } from "../../config/network"

const ButtonGroup = styled.div`
  display: flex;   
  flex-wrap: wrap; 
  justify-content: center;

  button {
      
      margin-top: 10px;
      :not(:first-child) {
          margin-left: 10px;
      }
  }
`;

const TypeGroup = styled(ButtonGroup)`
    justify-content: flex-start;
    flex: 1;
    height: 20px;
    font-size: 12px;

`

const StyledContainer = styled.div`

`

const Row = styled.div`
  display: flex;
  flex-direction: row;
`;

const NetworkPanel = styled.div`
  text-align: center;
  padding: 1rem;
  padding-top: 0rem;
  padding-bottom: 0rem;
`;

const Description = styled.p`
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
  font-size: 14px;
  padding: 1.5rem;
`;

const AllOrdersPanel = styled.div`
  display: flex;
  flex-wrap: wrap;
  padding-top: 20px;
`;

const CollectionsPanel = styled.div.attrs(() => ({ className: "row" }))`
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
  padding-top: 0px;
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
  const [chain, setChain] = useState();
  const [showCollection, setShowCollection] = useState(false);
  const [orders, setOrders] = useState([]);
  const [collections, setCollections] = useState([]);

  const [filter, setFilter] = useState({})

  const [max, setMax] = useState(MAX_ITEMS);

  const { getAllOrders, getCollectionInfo } = useOrder()

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

  const getCollection = async (address, chainId) => {

    const data = await getCollectionInfo(address, chainId)

    return {
      ...data,
      assetAddress: address,
      chainId
    }
  }

  useEffect(() => {
    const collections = orders.reduce((array, item) => {
      if (array.indexOf(item.assetAddress) === -1) {
        array.push(item.assetAddress)
      }
      return array
    }, [])

    const chainId = orders && orders.length > 0 ? orders[0].chainId : 1

    Promise.all(collections.map(item => getCollection(item, chainId))).then(setCollections)

  }, [orders])

  const updateChain = (chainId) => {
    setChain(chainId)
    localStorage.setItem("chainId", `${chainId}`)
  }

  const { getAllOrders } = useOrder();

  const getIcon = (chainId) => {
    const network = NETWORK.find(item => parseInt(chainId) === parseInt(item.chainId, 16))
    return network && network.icon
  }

  const filtered = useMemo(() => {

    if (Object.keys(filter).length === 0) {
      return orders
    }

    let output = orders

    if (filter['collection']) {
      const c = collections.find((item, index) => (index + 1) === filter['collection'])
      output = output.filter(item => item.assetAddress.toLowerCase() === c.assetAddress.toLowerCase())
    }

    if (filter['type']) {
      console.log(filter['type'], output)
      output = output.filter(item => (item.tokenType + 1) === filter['type'])
    }

    return output

  }, [orders, collections, filter])

  return (
    <StyledContainer>

      <SearchSection>
        <NetworkPanel>
          <ButtonGroup>
            <ToggleButton onClick={() => updateChain(1)} active={chain === 1}>
              <img style={{ borderRadius: "50%" }} width={32} src={getIcon(1)} />{` `}Ethereum
            </ToggleButton>
            <ToggleButton onClick={() => updateChain(137)} active={chain === 137}>
              <img style={{ borderRadius: "50%" }} width={32} src={getIcon(137)} />{` `}Polygon
            </ToggleButton>
            <ToggleButton onClick={() => updateChain(56)} active={chain === 56}>
              <img style={{ borderRadius: "50%" }} width={32} src={getIcon(56)} />{` `}BNB
            </ToggleButton>
            <ToggleButton onClick={() => updateChain(43114)} active={chain === 43114}>
              <img style={{ borderRadius: "50%" }} width={32} src={getIcon(43114)} />{` `}Avalanche
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
          <p style={{ marginTop: "15px", fontSize: "10px" }}>The hackathon version can be accessible from <a style={{ color: "inherit" }} href="https://marketplace-10x.tamago.finance" target="_blank">here</a></p>
        </NetworkPanel>
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

                      return [index + 1, value.title || shortAddress(value.assetAddress)]
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
                  <Button onClick={() => setMax(max + 8)}>View More Items...</Button>
                )}
              </div>
            </>
          )
        }
        {/* SHOW COLLECTIONS */}
        {showCollection && (
          <>
            <CollectionsPanel>
              {(!collections || collections.length === 0) && <Col className="col-4"><Collection orders={[]} /></Col>}

              {collections.map((collection, index) => {
                const { assetAddress } = collection
                const collectionOrders = orders.filter(item => item.assetAddress === assetAddress)
                return (
                  <Col className="col-4">
                    <Collection
                      delay={index}
                      orders={collectionOrders}
                      collection={collection}
                    >

                    </Collection>
                  </Col>
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
