const Reading = require('./readings.model')

module.exports = {
  getReadings: async (req, res) => {
    const readings = await Reading.find({})

    res.json({
      success: true,
      readings
    })
  },

  insertReading: async (req, res) => {
    const reading = new Reading(req.body)
    const nowSeconds = (new Date().getTime() / 1000)
    reading.created = nowSeconds

    await reading.save()

    res.json({
      success: true,
      reading
    })
  },
}
