const { db } = require("../firebase")


exports.getTestJSON = async (req, res, next) => {
  try {
    res.status(200).json({ message: "TESTGETJSON" })
  } catch (error) {
    next(error)
  }
}

exports.createMockData = async (req, res, next) => {
  try {
    const docRef = db.collection('users').doc('alovelace');

    await docRef.set({
      first: 'Ada',
      last: 'Lovelace',
      born: 1815
    });
    res.status(201).json({ message: "new collection created, check your database" })
  } catch (error) {
    next(error)
  }
}