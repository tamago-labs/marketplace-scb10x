import React, { useMemo, createContext, useState, useEffect } from "react";

export const NftCartsContext = createContext({});

const Provider = ({ children }) => {
  const [cartList, setCartList] = useState([]);

  const nftCartsContext = useMemo(
    () => ({
      cartList,
      setCartList,
    }),
    [cartList, setCartList]
  );
  return (
    <NftCartsContext.Provider value={nftCartsContext}>
      {children}
    </NftCartsContext.Provider>
  );
};

export default Provider;
