const { WHITELISTED_ADDRESSES } = require("../constants")

exports.getIsAdmin = async (req, res, next) => {
  try {
    const { address } = req.params
    const isAdmin = WHITELISTED_ADDRESSES.findIndex(item => item.toLowerCase() === address.toLowerCase()) !== -1
    return res.status(200).json({ status: "ok", isAdmin })
  } catch (error) {
    next(error)
  }
}