
Here are some experiments with different secp256k1 node libraries.

- `ssb-server.js` demonstrates signing on secp256k1 and ed25519 on the same instance of sbot
- `index.test.js` demonstrates using node-secp256k1 to generate keys and create Diffie-Hellman shared secrets, and [ethereumjs/keythereum](https://github.com/ethereumjs/keythereum) to show the corresponding Ethereum addresses.
- `elliptic.js` demonstrates using [elliptic](https://github.com/indutny/elliptic) to generate keys and do Diffie-Hellman.
- `private-box.js` is an implementation of scuttlebutt's [private-box](https://github.com/auditdrivencrypto/private-box) which works with secp256k1 keys and **almost** with a mixture of recipients having both curve25519 and secp256k1 keypairs.  Highly experimental and not recommended for use in the wild.
