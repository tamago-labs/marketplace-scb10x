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
import { ACCOUNT_API_BASE } from "../constants"

export const AccountContext = createContext({})

const Provider = ({ children }) => {
  const [state, dispatch] = useReducer(
    (prevState, action) => {
      switch (action.type) {
        case "UPDATE_EMAIL":

          const { email, nickname } = action.data

          return {
            ...prevState,
            email,
            nickname
          }
        default:
          return {
            ...prevState,
          }
      }
    },
    {
      email: null,
      nickname: null
    }
  )

  const { email, nickname } = state

  const context = useWeb3React()

  const { chainId, account, library } = context

  const [tick, setTick] = useState(0)

  const increaseTick = useCallback(() => {
    setTick(tick + 1)
  }, [tick])

  useEffect(() => {
    if (account) {
      axios
        .get(`${ACCOUNT_API_BASE}/account/${account}`)
        .then(({ data }) => {
          if (data.status === "ok") {
            const { email } = data
            dispatch({
              type: "UPDATE_EMAIL", data: {
                email,
                nickname: data.nickname || ""
              }
            })
          }
          if (data.status === "error" && data.message === "Invalid ID") {
            dispatch({
              type: "UPDATE_EMAIL", data: {
                email: "",
                nickname
              }
            })
          }
        })
    }
  }, [account])

  const signMessage = useCallback(async (message) => {
    return {
      message,
      signature: await library.getSigner().signMessage(message)
    }
  }, [account, library])

  const updateAccount = useCallback(
    async ({
      email,
      nickname
    }) => {
      if (account) {

        const { message, signature } = await signMessage("Please sign the message to update your account!")

        const payload = {
          username: account,
          nickname,
          address: account,
          disabled: false,
          email,
          message,
          signature
        }

        await axios.post(`${ACCOUNT_API_BASE}/account`, payload)

        dispatch({
          type: "UPDATE_EMAIL", data: {
            email,
            nickname
          }
        })
      }
    },
    [account]
  )

  const accountContext = useMemo(
    () => ({
      increaseTick,
      updateAccount,
      email,
      nickname
    }),
    [increaseTick, updateAccount, email, nickname]
  )

  return (
    <AccountContext.Provider value={accountContext}>
      {children}
    </AccountContext.Provider>
  )
}

export default Provider
