const mongoose = require('mongoose')
mongoose.Promise = Promise

const config = require('../config')

const DB_URI = config.DATABASE_URI[process.env.NODE_ENV] || config.DATABASE_URI.dev

mongoose.connect(`mongodb://${DB_URI}`, {
  useNewUrlParser: true
})

mongoose.connection.on('connected', () => {
  console.log(`Mongoose default connection open to ${DB_URI}`)
})
