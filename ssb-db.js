var pull = require('pull-stream')
var fs = require('fs')

// paths:
var pathToDB     = './db'
var pathToSecret = './ssb-identity'
try { fs.mkdirSync(pathToDB) } catch(e) {}

// ways to create keys:
// var keys = require('ssb-keys').generate()
// var keys = require('ssb-keys').generate('secp256k1')
//var keys = require('ssb-keys').loadSync(pathToSecret)
// var keys = require('ssb-keys').createSync(pathToSecret)
var keys = require('ssb-keys').loadOrCreateSync(pathToSecret, 'secp256k1')

console.log(keys)
var ssb = require('ssb-db/create')(pathToDB, {})
var feed = ssb.createFeed(keys)

feed.add({ type: 'post', text: 'My First Post!' }, function (err, msg, hash) {
  // the message as it appears in the database:
  console.log('msg', msg)

  // and its hash:
  console.log('hash', hash)
  pull(
    ssb.createHistoryStream({id: feed.id}),
    pull.collect(function (err, ary) {
      console.log('collected',ary)
    })
  )
})

