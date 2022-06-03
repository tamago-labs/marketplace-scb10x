export const shortAddress = (address, first = 6, last = -4) => {
  return `${address.slice(0, first)}...${address.slice(last)}`
}

export const resolveNetworkName = (networkId) => {
  switch (networkId) {
    case 1:
      return "Ethereum"
    case 42:
      return "Kovan"
    case 56:
      return "BNB Smart Chain"
    case 137:
      return "Polygon"
    case 80001:
      return "Mumbai"
    default:
      return "Not Support Chain"
  }
}

export const resolveBlockexplorerLink = (networkId, assetAddress, tokenId) => {
  switch (networkId) {
    case 42:
      return `https://kovan.etherscan.io/address/${assetAddress}`
    case 80001:
      return `https://mumbai.polygonscan.com/address/${assetAddress}`
    default:
      return "#"
  }
}

export const resolveNetworkIconUrl = (networkId) => {
  switch (networkId) {
    case 1:
      return "https://raw.githubusercontent.com/sushiswap/icons/master/network/mainnet.jpg"
    case 42:
      return "https://raw.githubusercontent.com/sushiswap/icons/master/network/kovan.jpg"
    case 56:
      return "https://raw.githubusercontent.com/sushiswap/icons/master/network/bsc.jpg"
    case 137:
      return "https://raw.githubusercontent.com/sushiswap/icons/master/network/polygon.jpg"
    case 80001:
      return "https://raw.githubusercontent.com/sushiswap/icons/master/network/polygon.jpg"
    default:
      return "https://via.placeholder.com/30x30"
  }
}

export const countdown = (seconds) => {
  let days = 0
  let hoursLeft = 0
  let hours = 0
  let minutesLeft = 0
  let minutes = 0
  let remainingSeconds = 0

  if (seconds > 0) {
    days = Math.floor(seconds / 24 / 60 / 60)
    hoursLeft = Math.floor(seconds - days * 86400)
    hours = Math.floor(hoursLeft / 3600)
    minutesLeft = Math.floor(hoursLeft - hours * 3600)
    minutes = Math.floor(minutesLeft / 60)
    remainingSeconds = seconds % 60
  }

  const pad = (n) => {
    return n < 10 ? "0" + n : n
  }

  return {
    days: pad(days),
    hoursLeft: pad(hoursLeft),
    hours: pad(hours),
    minutesLeft: pad(minutesLeft),
    minutes: pad(minutes),
    remainingSeconds: pad(remainingSeconds),
  }
}

export const resolveStatus = ({
  canceled,
  fulfilled,
}) => {
  if (canceled) {
    return "Canceled"
  } else if (fulfilled) {
    return "Sold"
  } else {
    return "New"
  }
}