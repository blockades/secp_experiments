const secp256k1 = require('secp256k1')
const { randomBytes } = require('crypto')

// This gives use methods of the same form as nacl
// for use with ssb-keys

exports.generateKeys =
exports.generate = function () {
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

exports.sign = function (privateKey, message) {
  // arguments are the other way around
  return secp256k1.sign(message, privateKey)
}

exports.verify = function (publicKey, signature, message) {
  // arguments are the other way around
  return secp256k1.verify(message, signature, publicKey)
}
