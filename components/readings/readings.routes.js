const router = require('express-promise-router')()

const {
  getReadings,
  insertReading,
} = require('./readings.controller')

router.route('/')
  .get(getReadings)
  .post(insertReading)

module.exports = router
