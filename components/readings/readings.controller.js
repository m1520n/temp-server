const Reading = require('./readings.model')

module.exports = {
  getReadings: async (req, res) => {
    const { limit } = req.params;
    const readings = await Reading.find({}).sort({ createdAt: -1 }).limit(limit || 100)

    res.json({
      success: true,
      readings,
      count: readings.length,
    })
  },

  getLatestReading: async (req, res) => {
    const reading = await Reading.findOne({}).sort({ createdAt: -1 })

    res.json({
      success: true,
      reading
    })
  },

  insertReading: async (req, res) => {
    const reading = new Reading(req.body)

    await reading.save()

    res.json({
      success: true,
      reading
    })
  },
}
