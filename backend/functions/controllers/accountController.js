const { db } = require("../firebase")
const { ethers } = require("ethers");
const validator = require("validator")

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
    console.log("creating/updating an account")
    const { address, disabled = false, email, message, signature, nickname } = req.body
    // console.log({ address, disabled, email, message, signature, nickname })

    if (!(address)) {
      return res.status(400).json({ message: "Address is required." })
    }

    if (!validator.isEthereumAddress(address)) {
      return res.status(400).json({ message: "The address is not in proper wallet address form." })
    }

    if (email && !validator.isEmail(email)) {
      return res.status(400).json({ message: "Email address not in proper format." })
    }

    if (!(address && message && signature)) {
      return res.status(400).json({ message: "Message and signature are required for verification." })
    }

    // verify the message and signature
    console.log("Verifying the address :  ", address)
    const recoveredAddress = ethers.utils.verifyMessage(message, signature)
    console.log("Recovered address : ", recoveredAddress)
    if (recoveredAddress.toLowerCase() !== address.toLowerCase()) {
      return res.status(400).json({ message: "invalid signed message" })
    }

    //prevent duplicate registration
    let existed = await db.collection("accounts").where("address", "==", address).get()
    if (!existed.empty) {
      //Update existing doc
      let DocID = ""
      existed.forEach(doc => {
        DocID = doc.id
      });

      let newData = {}

      if (nickname !== undefined && typeof nickname === "string") {
        newData.nickname = nickname
      }

      if (email !== undefined && typeof email === "string") {
        newData.email = email
      }
      console.log(newData)
      if (Object.keys(newData).length > 0) {
        await db.collection("accounts").doc(DocID).set({ ...newData }, { merge: true })
        return res.status(200).json({ status: "ok", message: "Data successfully updated" })
      } else {
        return res.status(400).json({ message: "Empty input, nothing to update." })
      }
    } else {
      //Add new doc
      const newDoc = {
        nickname: nickname || "unknown",
        address,
        disabled,
        email,
      }
      console.log("saving : ", newDoc)

      await db.collection("accounts").add(newDoc)

      return res.status(201).json({ status: "ok", message: "Data successfully created." })
    }
  } catch (error) {
    next(error)
  }
}