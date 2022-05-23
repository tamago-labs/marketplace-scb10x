import { createGlobalStyle } from 'styled-components'
import Header from './components/header'
import Jumbotron from './components/jumbotron'
import Lists from './components/lists'

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
      <Header />
      <Jumbotron />
      <Lists />
    </div>
  );
}

export default App;
