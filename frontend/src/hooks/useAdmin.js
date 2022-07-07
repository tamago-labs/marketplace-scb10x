import axios from "axios"
import { useCallback } from "react"
import { useWeb3React } from "@web3-react/core";
import { API_BASE } from "../constants";

const useAdmin = () => {


  const context = useWeb3React();

  const { account, library } = context;


  const getIsAdmin = useCallback(
    async () => {
      const { data } = await axios.get(`${API_BASE}/admin/is-admin/${account}`)
      const { isAdmin } = data
      return isAdmin
    },
    [account],
  )

  const getAllDisputes = useCallback(
    async () => {
      const { data } = await axios.get(`${API_BASE}/disputes`)
      const { disputes } = data
      return disputes
    },
    [],
  )
  const signMessage = useCallback(
    async (message) => {
      return {
        message,
        signature: await library.getSigner().signMessage(message),
      };
    },
    [account, library]
  );

  return {
    getIsAdmin, getAllDisputes, signMessage
  }
}

export default useAdmin