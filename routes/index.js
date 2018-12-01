const express = require('express')
const router = require('express-promise-router')()
const bodyParser = require('body-parser')

const Readings = require('../components/readings/readings.routes')

router.use(bodyParser.urlencoded({ limit: '5mb', extended: true }))
router.use(bodyParser.json({ limit: '5mb' }))
router.use(bodyParser.json({ type: 'application/vnd.api+json' }))

router.use('/api/readings', Readings)

router.get('/', (req, res) => {
  res.send('Welcome to Temperature-API!')
})

module.exports = router
