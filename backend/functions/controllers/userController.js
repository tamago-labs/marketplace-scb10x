const { db } = require("../firebase")


exports.getUsers = async (req, res, next) => {
  try {
    const { limit, offset } = req.query

    let users = await db.collection("users").orderBy("activeSellCount", "desc").limit(+limit || 10).offset(+offset || 0).get()

    if (users.empty) {
      return res.status(204).json({ message: "empty query return" })
    }

    users = users.docs.map((doc, index) => ({
      ...doc.data(),
      queryIndex: (+offset || 0) + index + 1
    }))

    const totalUsers = await db.collection("users").get()
    const totalCount = totalUsers.size
    // console.log(totalCollections.size)

    // console.log(result)

    res.status(200).json({ status: "ok", users, totalCount })
  } catch (error) {
    next(error)
  }
}

exports.getUserByAddress = async (req, res, next) => {
  try {
    const { address } = req.params
    if (!address) {
      return res.status(400).json({ message: "address is required" })
    }
    let user = await db.collection("users").where("address", "==", address).get()
    if (user.empty) {
      return res.status(204).json({ message: "empty query return" })
    }
    user = user.docs.map((doc) => ({
      ...doc.data(),
    }))[0]

    res.status(200).json({ status: "ok", user })
  } catch (error) {
    next(error)
  }
}