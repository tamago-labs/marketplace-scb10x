import { createGlobalStyle } from "styled-components";
import { Routes, Route, Link } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Header from "./components/header";
import Home from "./components/Home";
import Footer from "./components/footer";
import OrderDetails from "./components/OrderDetails";
import CreateOrder from "./components/CreateOrder";
import Collection from "./components/Collection";
import CreatorPage from "./components/CreatorPage";
import Account from "./components/Account";
import Faucet from "./components/Faucet";
import AllCollectionPage from "./components/AllCollectionPage";
import AllSellerPage from "./components/AllSellerPage";

import "react-toastify/dist/ReactToastify.css";

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  body {
    font-family: 'VT323', monospace;
    color: white;
    /* Full height */
    height: 100vh;
    /* Center and scale the image nicely */
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    background: linear-gradient(to right, #896eff 0, #5f3bff 51%, #896eff 100%);
  }
`;

function App() {
  return (
    <div className="App">
      <GlobalStyle />
      <ToastContainer
        position="top-left"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        draggable
      />
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/order/:id" element={<OrderDetails />} />
        <Route path="/createOrder" element={<CreateOrder />} />
        <Route path="/orders/collection/:address" element={<Collection />} />
        <Route path="/orders/owner/:ownerAddress" element={<CreatorPage />} />
        <Route path="/account" element={<Account />} />
        <Route path="/faucet" element={<Faucet />} />
        <Route path="/all-collections" element={<AllCollectionPage />} />
        <Route path="/all-sellers" element={<AllSellerPage />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
