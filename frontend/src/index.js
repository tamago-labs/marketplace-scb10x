import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import { Web3ReactProvider } from "@web3-react/core"
import { MoralisProvider } from "react-moralis"
import { ethers } from "ethers"
import AccountProvider from "./hooks/useAccount"
import App from "./App"
import reportWebVitals from "./reportWebVitals"
import "bootstrap/dist/css/bootstrap.min.css"
import "react-loading-skeleton/dist/skeleton.css"
import { SkeletonTheme } from "react-loading-skeleton"
import { MORALIS_URL, MORALIS_ID } from "./constants"

const getLibrary = (provider) => {
  const library = new ethers.providers.Web3Provider(provider)
  library.pollingInterval = 12000
  return library
}

const root = ReactDOM.createRoot(document.getElementById("root"))
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Web3ReactProvider getLibrary={getLibrary}>
        <MoralisProvider serverUrl={MORALIS_URL} appId={MORALIS_ID}>
          <SkeletonTheme highlightColor="#ccc">
            <AccountProvider>
              <App />
            </AccountProvider>
          </SkeletonTheme>
        </MoralisProvider>
      </Web3ReactProvider>
    </BrowserRouter>
  </React.StrictMode>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
