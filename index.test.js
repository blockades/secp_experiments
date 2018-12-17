const k = require('keythereum')
const secp256k1 = require('secp256k1')
const { createHash } = require('crypto')
const sha256 = createHash('sha256')
const generateKeys = require('.')

const alice = generateKeys()
const bob = generateKeys()

console.log('Alice secret key: ', alice.secretKey.toString('hex'))
console.log('Alice public key, short form: ', alice.publicKey.toString('hex'))
console.log('Alice public key, long form:  ', secp256k1.publicKeyCreate(alice.secretKey, false).toString('hex'))

console.log('Alice public key, convert:    ', secp256k1.publicKeyConvert(alice.publicKey, false).toString('hex'))
console.log('Bob secret key: ', bob.secretKey.toString('hex'))
console.log('Bob public key: ', bob.publicKey.toString('hex'))

console.log('ecdh shared secret alicepk, bobsk ', secp256k1.ecdh(alice.publicKey, bob.secretKey).toString('base64'))
console.log('ecdh shared secret bobpk, alicesk ', secp256k1.ecdh(bob.publicKey, alice.secretKey).toString('base64'))


console.log('sha256(ecdhUnsafe), to demonstrate it is the same as ecdh: ', sha256.update(secp256k1.ecdhUnsafe(alice.publicKey, bob.secretKey)).digest().toString('base64'))

console.log('ecdhUnsafe alicepk, bobsk: ', secp256k1.ecdhUnsafe(alice.publicKey, bob.secretKey).toString('base64'))
console.log('ecdhUnsafe bobsk, alicepk: ', secp256k1.ecdhUnsafe(bob.publicKey, alice.secretKey).toString('base64'))

console.log('Alice\'s Ethereum address: ', k.privateKeyToAddress(alice.secretKey))
console.log('Bob\'s Ethereum address: ', k.privateKeyToAddress(bob.secretKey))
