const router = require('express-promise-router')()

const {
  getReadings,
  insertReading,
  getLatestReading,
} = require('./readings.controller')

router.route('/')
  .get(getReadings)
  .post(insertReading)

router.router('/latest')
  .get(getLatestReading)

module.exports = router
