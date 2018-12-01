const api = require('./api')
const config = require('./config')

const PORT = config.PORT

api.listen(PORT, () => {
  console.log(`API listening on: ${PORT}`)
})

module.exports = api