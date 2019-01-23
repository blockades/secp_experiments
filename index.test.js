const test = require('tape-plus')
const { generate, sign, verify } = require('.')

const message = Buffer.from('roundabout again asldk malskdm asd')

test('Sign and verify', t => {
  const keyPair = generate()
  t.ok(keyPair, 'returns a keypair')
  const signature = sign(keyPair.secretKey, message)
  t.ok(signature, 'returns a signature')
  t.ok(verify(keyPair.publicKey, signature, message), 'signature valid')
})
