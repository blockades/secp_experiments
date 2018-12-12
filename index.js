const k = require('keythereum')
const secp256k1 = require('secp256k1')
const { randomBytes, createHash } = require('crypto')
const sha256 = createHash('sha256');

function generateKeys() {
  let secretKey
  do {
    secretKey = randomBytes(32)
  } while (!secp256k1.privateKeyVerify(secretKey))

  // get the public key in a compressed format
  return {
    secretKey,
    publicKey: secp256k1.publicKeyCreate(secretKey)
  }
}

const alice = generateKeys()
const bob = generateKeys()

console.log('ecdh: ', secp256k1.ecdh(alice.publicKey, bob.secretKey))
console.log('ecdh: ', secp256k1.ecdh(bob.publicKey, alice.secretKey))


console.log('ecdhUnsafe with a sha256, to demonstrate it is the same as ecdh: ',sha256.update(secp256k1.ecdhUnsafe(alice.publicKey, bob.secretKey)).digest())

console.log('ecdhUnsafe', secp256k1.ecdhUnsafe(alice.publicKey, bob.secretKey))
console.log('ecdhUnsafe', secp256k1.ecdhUnsafe(bob.publicKey, alice.secretKey))



console.log('Ethereum address: ', k.privateKeyToAddress(alice.secretKey))
