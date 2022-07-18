import { useState, useEffect } from "react";
import { Carousel } from "react-bootstrap";
import useOrder from "../../hooks/useOrder";
import NFTCard from "../nftCard";
import styled from "styled-components";

/** Styled Component */
const ListContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-top: 32px;
  justify-content: center;
`;

/** CONSTANT */
const MAX_ITEMS = 4;

/** Component */
const CarouselCard = ({ address }) => {
  const [index, setIndex] = useState(0);
  const [allOrders, setAllOrders] = useState([]);
  const [max, setMax] = useState(MAX_ITEMS);
  const [slideNum, setSlideNum] = useState();
  const { getOrdersByCollection } = useOrder();

  const handleSelect = (selectedIndex, e) => {
    setIndex(selectedIndex);
  };

  useEffect(() => {
    address && getOrdersByCollection(address).then(setAllOrders);
  }, [address]);

  useEffect(() => {
    let w = window.innerWidth;
    if (w < 700) {
      setMax(1);
    } else if (w < 1000) {
      setMax(2);
    } else {
      setMax(4);
    }
  }, [window.innerWidth]);

  useEffect(() => {
    let slide = Math.ceil(allOrders.length / max);
    if (slide > 4) {
      setSlideNum(4);
    } else {
      setSlideNum(slide);
    }
  }, [max, allOrders]);

  return (
    <Carousel activeIndex={index} onSelect={handleSelect} indicators={false}>
      <Carousel.Item>
        <ListContainer>
          {allOrders.length === 0 && <>No Item</>}
          {allOrders.length > 0 &&
            allOrders.map((order, index) => {
              if (index < max) {
                return (
                  <NFTCard
                    key={index}
                    delay={index % MAX_ITEMS}
                    order={order}
                  />
                );
              }
            })}
        </ListContainer>
      </Carousel.Item>
      {slideNum > 1 ? (
        <Carousel.Item>
          <ListContainer>
            {allOrders.length === 0 && <>No Item</>}
            {allOrders.length > 0 &&
              allOrders.map((order, index) => {
                if (index >= max && index < max + max) {
                  return (
                    <NFTCard
                      key={index}
                      delay={index % MAX_ITEMS}
                      order={order}
                    />
                  );
                }
              })}
          </ListContainer>
        </Carousel.Item>
      ) : (
        " "
      )}
      {slideNum > 2 ? (
        <Carousel.Item>
          <ListContainer>
            {allOrders.length === 0 && <>No Item</>}
            {allOrders.length > 0 &&
              allOrders.map((order, index) => {
                if (index >= max * 2 && index < max * 3) {
                  return (
                    <NFTCard
                      key={index}
                      delay={index % MAX_ITEMS}
                      order={order}
                    />
                  );
                }
              })}
          </ListContainer>
        </Carousel.Item>
      ) : (
        " "
      )}
    </Carousel>
  );
};

export default CarouselCard;
