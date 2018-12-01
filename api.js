require('dotenv').config()

const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

require('./database')
const routes = require('./routes')

app.use(cors())
app.use(morgan('dev'))
app.use('/', routes)

// Error handler
app.use((error, req, res, next) => {
  res.json({
    success: false,
    message: error.stack
  })
})

module.exports = app
