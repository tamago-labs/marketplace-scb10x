
exports.getTestJSON = async (req, res, next) => {
  try {
    res.status(200).json({ message: "TESTGETJSON" })
  } catch (error) {
    next(error)
  }
}