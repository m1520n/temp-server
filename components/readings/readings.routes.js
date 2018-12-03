const router = require('express-promise-router')()

const {
  getReadings,
  insertReading,
  getReadingsById,
  getLatestReadingsById,
  getLatestReadingsForSensors
} = require('./readings.controller')

router.route('/')
  .get(getReadings)
  .post(insertReading)

router.route('/:id')
  .get(getReadingsById)

router.route('/latest')
  .get(getLatestReadingsForSensors)

router.route('/latest/:id')
  .get(getLatestReadingsById)

module.exports = router
