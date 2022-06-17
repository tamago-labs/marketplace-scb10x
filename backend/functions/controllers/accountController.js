const { db } = require("../firebase")
const { ethers } = require("ethers");

exports.getAccount = async (req, res, next) => {
  try {
    const { address } = req.params
    if (!address) {
      return res.status(400).json({ message: "address is required." })
    }

    let account = await db.collection("accounts").where("address", "==", address).get()

    if (account.empty) {
      return res.status(400).json({ message: "We could not find account with this address in the database." })
    }

    account = account.docs.map((doc) => ({
      ...doc.data(),
    }))[0]

    res.status(200).json({ status: "ok", account })
  } catch (error) {
    next(error)
  }
}

exports.createAccountWithSigning = async (req, res, next) => {
  try {
    console.log("creating an account")
    const { address, disabled = false, email, message, signature, nickname = "unknown" } = req.body
    console.log({ address, disabled, email, message, signature, nickname })
    // if (!(address && email && message && signature)) {
    //   return res.status(400).json({ message: "Some required inputs are missing." })
    // }

    if (!(address && email)) {
      return res.status(400).json({ message: "Some required inputs are missing." })
    }


    //prevent duplicate registration
    const existed = await db.collection("accounts").where("address", "==", address).get()
    if (!existed.empty) {
      return res.status("400").json({ message: "This wallet account has already been used for registration." })
    }

    // verify the address
    // console.log("Verifying the address :  ", address)
    // const recoveredAddress = ethers.utils.verifyMessage(message, signature)
    // console.log("Recovered address : ", recoveredAddress)
    // if (recoveredAddress.toLowerCase() !== address.toLowerCase()) {
    //   return res.status(400).json({ message: "invalid signed message" })
    // }

    const newDoc = {
      nickname,
      address,
      disabled,
      email,
    }
    console.log("saving : ", newDoc)

    await db.collection("accounts").add(newDoc)

    res.status(200).json({ status: "ok", address })
  } catch (error) {
    next(error)
  }
}