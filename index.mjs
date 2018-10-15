import ganache from 'ganache-core'
import url from 'url'

const port = 8545
const server = ganache.server({
  host: 'localhost'
})


let accounts = []
server.listen(port, function (err, blockchain) {
  if (err) {
    console.error(err)
    server.close()
    return
  }
  accounts = Object.keys(blockchain.personal_accounts)
})


server.on('request', (req, res) => {
  let params = url.parse(req.url, true).query

  console.log('params', params)

  if (req.url === '/accounts') {
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify(accounts))
  }
})
