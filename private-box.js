var sodium = require('chloride')
const secp256k1 = require('secp256k1')
var secretbox = sodium.crypto_secretbox_easy
var secretbox_open = sodium.crypto_secretbox_open_easy
var concat = Buffer.concat

const publicKeyLength = 33

function scalarmult (secretKeySecp, secretKey25519, pk) {
  switch (pk[0]) {
    case 0: return sodium.crypto_scalarmult(secretKey25519, pk.slice(1))
    case 2:
    case 3: return secp256k1.ecdh(pk, secretKeySecp)
    default: throw new Error('Public key not formatted as expected')
  }
}

function keypair () {
  let secretKey
  do {
    secretKey = randombytes(32)
  } while (!secp256k1.privateKeyVerify(secretKey))

  // get the public key in a compressed format
  return {
    secretKey,
    publicKey: secp256k1.publicKeyCreate(secretKey)
  }
}

function randombytes (n) {
  var b = Buffer.alloc(n)
  sodium.randombytes(b)
  return b
}

function setMax (m) {
  m = m || DEFAULT_MAX
  if (m < 1 || m > 255) throw new Error('max recipients must be between 0 and 255.')
  return m
}

const DEFAULT_MAX = 7

exports.encrypt =
exports.multibox = function (msg, recipients, max) {
  max = setMax(max)

  if (recipients.length > max) {
    throw new Error('max recipients is:' + max + ' found:' + recipients.length)
  }

  var nonce = randombytes(24)
  var key = randombytes(32)
  var oneTimeSecp = keypair()
  var oneTimeCurve25519 = sodium.crypto_box_keypair()
  var _key = concat([ Buffer.from([recipients.length & max]), key ])
  return concat([
    nonce,
    oneTimeSecp.publicKey,
    oneTimeCurve25519.publicKey,
    concat(recipients.map(function (r_pk, i) {
      return secretbox(
        _key,
        nonce,
        scalarmult(oneTimeSecp.secretKey, oneTimeCurve25519.secretKey, r_pk)
      )
    })),
    secretbox(msg, nonce, key)
  ])
}

exports.decrypt =
exports.multibox_open = function (ctxt, sk, max) {
  max = setMax(max)

  var nonce = ctxt.slice(0, 24)
  var oneTimeSecp_pk = ctxt.slice(24, 24 + publicKeyLength)
  var oneTime25519_pk = ctxt.slice(24 + publicKeyLength)
  var my_key = scalarmult(sk, onetime_pk)
  var _key, key, length
  var start = 24 + publicKeyLength + publicKeyLength
  var size = 32 + 1 + 16
  for (var i = 0; i <= max; i++) {
    var s = start + size * i
    if (s + size > (ctxt.length - 16)) continue
    _key = secretbox_open(ctxt.slice(s, s + size), nonce, my_key)
    if (_key) {
      length = _key[0]
      key = _key.slice(1)
      continue
    }
  }

  if (!key) return
  return secretbox_open(ctxt.slice(start + length * size), nonce, key)
}
