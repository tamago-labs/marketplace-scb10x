import { createGlobalStyle } from "styled-components";
import { Routes, Route, Link } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import Faucet from "./components/faucet";
import CreateOrder from "./components/createOrder"
import Header from "./components/header"
import Home from "./components/home"
import Footer from "./components/footer"
import OrderDetails from "./components/orderDetails"
import Launchpad from "./components/launchpad";
import Collection from "./components/collection"
import LaunchpadDetails from "./components/launchpad/details";

import "react-toastify/dist/ReactToastify.css";

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  body {
    font-family: monospace;
    color: white;
    /* Full height */ 
    background-image:  url('https://img.tamago.finance/bg-2.jpg');
    background-size: cover;
    background-repeat: no-repeat;
    min-height: 100vh;
  }
`;

function App() {
  return (
    <div className="App">
      <GlobalStyle />
      <Header />
    
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/faucet" element={<Faucet />} />
        <Route path="/create" element={<CreateOrder />} />
        <Route path="/order/:id" element={<OrderDetails />}/>
        <Route path="/launchpad" element={<Launchpad />} />
        <Route path="/launchpad/:slug" element={<LaunchpadDetails />} />
        <Route path="/collection/:chain/:address" element={<Collection />} />
      </Routes>
      <Footer/>
    </div>
  );
}

export default App;
