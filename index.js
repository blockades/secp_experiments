const secp256k1 = require('secp256k1')
const { randomBytes } = require('crypto')

module.exports = function generateKeys () {
  let secretKey
  do {
    secretKey = randomBytes(32)
  } while (!secp256k1.privateKeyVerify(secretKey))

  // public key is given in short form
  return {
    secretKey,
    publicKey: secp256k1.publicKeyCreate(secretKey)
  }
}
