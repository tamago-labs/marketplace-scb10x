import { createGlobalStyle } from "styled-components"
import { Routes, Route, Link } from "react-router-dom"
import Header from "./components/header"
import Home from "./components/Home"
import Footer from "./components/footer"
import OrderDetails from "./components/OrderDetails"
import CreateOrder from "./components/CreateOrder"
import Account from "./components/Account"

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
`

function App() {
  return (
    <div className="App">
      <GlobalStyle />
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/order/:id" element={<OrderDetails />} />
        <Route path="/createOrder" element={<CreateOrder />} />
        <Route path="/account" element={<Account />} />
      </Routes>
      <Footer />
    </div>
  )
}

export default App
