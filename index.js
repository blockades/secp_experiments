const secp256k1 = require('secp256k1')
const sodium = require('sodium-native')

function sha256 (message) {
  var hash = Buffer.alloc(sodium.crypto_hash_sha256_BYTES)
  sodium.crypto_hash_sha256(hash, message)
  return hash
}

function randomBytes (len) {
  var rb = Buffer.alloc(len)
  sodium.randombytes_buf(rb)
  return rb
}

// This gives us methods of the same form as nacl
// for use with ssb-keys

exports.generateKeys =
exports.generate = function () {
  let secretKey
  let n = 0
  do {
    n++
    secretKey = randomBytes(32)
  } while (!secp256k1.privateKeyVerify(secretKey))
  if (n > 1) console.log('n = ', n)
  // public key is given in short form
  return {
    secretKey,
    publicKey: secp256k1.publicKeyCreate(secretKey)
  }
}

exports.sign = function (secretKey, message) {
  const hash = sha256(message)
  // arguments are the other way around
  return secp256k1.sign(hash, secretKey).signature
}

exports.verify = function (publicKey, signature, message) {
  const hash = sha256(message)
  // arguments are the other way around
  return secp256k1.verify(hash, signature, publicKey)
}
