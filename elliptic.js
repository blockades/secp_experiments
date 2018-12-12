var EC = require('elliptic').ec
var ec = new EC('secp256k1')
const BN = require('bn.js')
// Generate keys
var key1 = ec.genKeyPair()
var key2 = ec.genKeyPair()

console.log(key1.priv.toBuffer().length)
console.log(key1.getPublic())

var shared1 = key1.derive(key2.getPublic())
var shared2 = key2.derive(key1.getPublic())

console.log('Both shared secrets are BN instances')
console.log(shared1.toString(16))
console.log(shared2.toString(16))
