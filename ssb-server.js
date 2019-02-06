var CreateTestSbot = require('scuttle-testbot')
var ssbKeys = require('ssb-keys')

var pietKeys = ssbKeys.generate('secp256k1')
var katieKeys = ssbKeys.generate()

var myTempSbot = CreateTestSbot({name: 'testBotName', keys: pietKeys})

var katie = myTempSbot.createFeed(katieKeys)
var piet = myTempSbot.createFeed(pietKeys)

piet.add({type: 'post', content: 'a message from piet, who signs with a secp256k1 keypair'}, (err, data) => {
  if (err) throw err
  console.log(data)
  katie.add({type: 'post', content: 'a message from katie who signs with an ed25519 keypair'},function(err, data) {
    if (err) throw err
    console.log(data)
    myTempSbot.close()
  })
})
