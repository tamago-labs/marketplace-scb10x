import React, {
  useEffect,
  useMemo,
  useReducer,
  createContext,
  useState,
  useCallback,
} from "react"
import { useWeb3React } from "@web3-react/core"
import axios from "axios"

export const AccountContext = createContext({})

const Provider = ({ children }) => {
  const [state, dispatch] = useReducer(
    (prevState, action) => {
      switch (action.type) {
        case "UPDATE_EMAIL":
          return {
            ...prevState,
            email: action.data,
          }
        default:
          return {
            ...prevState,
          }
      }
    },
    {
      email: null,
    }
  )

  const { email } = state

  const context = useWeb3React()

  const { chainId, account, library } = context

  const [tick, setTick] = useState(0)

  const increaseTick = useCallback(() => {
    setTick(tick + 1)
  }, [tick])

  useEffect(() => {
    if (account) {
      axios
        .get(`/api/account/${account}`)
        .then(({ data }) => {
          if (data.status === "ok") {
            const { email } = data
            dispatch({ type: "UPDATE_EMAIL", data: email })
          }
          if (data.status === "error" && data.message === "Invalid ID") {
            dispatch({ type: "UPDATE_EMAIL", data: " " })
          }
        })
    }
  }, [account])

  // useEffect(() => {

  //     (async () => {
  //         const { data } = await axios.get(`api/events`)
  //         if (data && data.events && data.events.length > 0) {

  //             const events = [{
  //                 "eventId": 8,
  //                 "visible": true,
  //                 "participants": [3],
  //                 "community": "Naga DAO",
  //                 "slug": "naga-nft-mar-2022-2",
  //                 "wallets": 168,
  //                 "ended": true,
  //                 "spots": 3,
  //                 "imageUrl": "https://img.tamago.finance/luckbox/event/event-2.png",
  //                 "claimStart": 1651042350,
  //                 "claimEnd": 1651215150,
  //                 "title": "Naga DAO NFT #TEST"
  //             }].concat(data.events)

  //             dispatch({ type: "UPDATE_EVENTS", data: events  })
  //         }
  //     })()
  // }, [])

  const getProof = useCallback(async (eventId) => {
    let result
    try {
      const { data } = await axios.get(
        `/api/events/proof/${eventId}`
      )
      result = data
    } catch (e) {
      console.error(e)
    }
    return result
  }, [])

  const updateAccount = useCallback(
    async (email) => {
      if (account) {
        const buffer = btoa(
          JSON.stringify({
            username: account,
            address: account,
            disabled: false,
            email,
          })
        )

        await axios.get(`/api/createAccount/${buffer}`)
        dispatch({ type: "UPDATE_EMAIL", data: email })
      }
    },
    [account]
  )

  const createEvent = useCallback(async (form) => {
    if (form) {
      // const buffer = btoa(JSON.stringify({
      //     ...form
      // }))
      // console.log(form)
      // return await axios.get(`/api/createEvent/${buffer}`)
      return await axios.post(`/api/events/create`, form)
    }
  }, [])

  const register = useCallback(
    async (eventId) => {
      if (account) {
        const buffer = btoa(
          JSON.stringify({
            walletAddress: account,
            eventId,
          })
        )

        await axios.get(`/api/register/${buffer}`)
      }
    },
    [account]
  )

  const getRegistered = useCallback(async (eventId) => {
    const response = await axios.get(
      `/api/events/registered/${eventId}`
    )
    if (response && response.data && response.data.status === "ok") {
      return response.data.registered
    }
    return []
  }, [])

  const accountContext = useMemo(
    () => ({
      increaseTick,
      updateAccount,
      createEvent,
      email,
      getProof,
      register,
      getRegistered,
    }),
    [increaseTick, updateAccount, createEvent, email, register]
  )

  return (
    <AccountContext.Provider value={accountContext}>
      {children}
    </AccountContext.Provider>
  )
}

export default Provider
