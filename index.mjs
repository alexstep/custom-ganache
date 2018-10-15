import ganache from 'ganache-core'
// import url from 'url'

let state = {}


const LogListener = {
  log (log) {
    let data = {}
    try {
      data = JSON.parse(log.split('   >').join(''))
    } catch (err) {}

    if (data.method) {
      this.event(data.method, data)
    }
  },

  event (action, data) {
    console.log('EVENT', action, data)
  }
}


// more https://github.com/trufflesuite/ganache-cli/blob/develop/cli.js#L73
const options = {
  hostname : 'localhost',
  port     : 8545,
  logger   : LogListener,
  verbose  : true
}


const server = ganache.server(options)
server.listen(options.port, options.hostname, (err, result) => {
  if (err) {
    console.error(err)
    server.close()
    return
  }

  state = result || server.provider.manager.state

  state.privkeys = []
  Object.keys(state.accounts).forEach((address, i) => {
    state.privkeys.push({
      address : address,
      privkey : '0x' + state.accounts[address].secretKey.toString('hex'),
      balance : parseInt(state.accounts[address].account.balance.toString('hex'), 16) / 10 ** 18
    })
  })
})



server.on('request', (req, res) => {
  // let params = url.parse(req.url, true).query
  // console.log('params', params)

  res.writeHead(200, { 'Content-Type': 'application/json' })
  
  if (req.url === '/mnemonic') {
    res.end(JSON.stringify({ phrase:state.mnemonic }))
  }
  
  if (req.url === '/accounts') {
    res.end(JSON.stringify(state.privkeys))
  }
})


