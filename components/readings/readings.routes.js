const router = require('express-promise-router')()

const {
  getReadings,
  insertReading,
  getLatestReading,
} = require('./readings.controller')

router.route('/')
  .get(getReadings)
  .post(insertReading)

router.route('/:id')
  .get(getReadingsById)

router.route('/latest/:id')
  .get(getLatestReadings)

module.exports = router
