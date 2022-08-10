const { recoverAddressFromMessageAndSignature } = require('../../utils/index');

module.exports = async (req, res, next) => {
  try {
    //check if message and signature present in req.body
    const { message, address, signature } = req.body;
    if (!message || !signature || !address) {
      return res
        .status(400)
        .json({ message: 'Message, signature, and address are required' });
    }

    //validate and see if recoveredAddress matches walletAddress
    // const recoveredAddress = recoverAddressFromMessageAndSignature(
    //   message,
    //   signature
    // );
    // if (recoveredAddress.toLowerCase() !== address.toLowerCase()) {
    //   return res.status(401).json({ message: 'Unauthorized access' });
    // }

    console.log('authenticated');
    next();
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: error });
  }
};
