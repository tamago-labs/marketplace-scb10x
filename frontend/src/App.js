import { createGlobalStyle } from "styled-components";
import { Routes, Route, Link } from "react-router-dom";
import Header from "./components/header";
import Home from "./components/Home";
import Footer from "./components/footer";
import OrderDetails from "./components/OrderDetails";
import CreateOrder from "./components/CreateOrder";
import Collection from "./components/Collection";
import SortByOwner from "./components/SortByOwner";

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  body {
    font-family: 'Poppins','VT323', monospace;
    color: white;
    font-weight: 400;
    /* Full height */
    height: 100vh;
    /* Center and scale the image nicely */
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    background: linear-gradient(to right, #FA58B6 31.12%, #7A0BC0 89.4%);
  }
`;

function App() {
  return (
    <div className="App">
      <GlobalStyle />
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/order/:id" element={<OrderDetails />} />
        <Route path="/createOrder" element={<CreateOrder />} />
        <Route path="/orders/collection/:address" element={<Collection />} />
        <Route path="/orders/owner/:ownerAddress" element={<SortByOwner />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
