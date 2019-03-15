const CreateTestSbot = require('scuttle-testbot')
const ssbKeys = require('ssb-keys')

// A demonstration of publishing messages with both secp256k1 and ed25519
// keypairs on the same instance of sbot

var pietKeys = ssbKeys.generate('secp256k1')
var katieKeys = ssbKeys.generate()

var myTempSbot = CreateTestSbot({name: 'testBotName', keys: pietKeys})

var katie = myTempSbot.createFeed(katieKeys)
var piet = myTempSbot.createFeed(pietKeys)

console.log("Piet's secp256k1 feed id:", piet.id)
console.log("Katie's ed25519 feed id:", katie.id)

piet.add({type: 'post', content: 'A message from piet, who signs with a secp256k1 keypair'}, (err, data) => {
  if (err) throw err
  console.log(data)
  katie.add({type: 'post', content: 'A message from katie who signs with an ed25519 keypair'}, (err, data) => {
    if (err) throw err
    console.log(data)
    myTempSbot.close()
  })
})
