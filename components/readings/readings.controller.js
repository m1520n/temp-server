const Reading = require('./readings.model')

module.exports = {
  getReadings: async (req, res) => {
    const { limit } = req.query;
    const readings = await Reading
      .find({})
      .sort({ createdAt: -1 })
      .limit((limit && parseInt(limit)) || 0)

    res.json({
      success: true,
      readings,
      count: readings.length,
    })
  },

  getReadingsById: async (req, res) => {
    const { id } = req.params;
    const { limit } = req.query;

    const readings = await Reading
      .find({ sensorId: id })
      .sort({ createdAt: -1 })
      .limit((limit && parseInt(limit)) || 0)

    res.json({
      success: true,
      readings,
      count: readings.length,
    })
  },

  getLatestReadingsById: async (req, res) => {
    const { id } = req.params;
    const reading = await Reading
      .findOne({ sensorId: id })
      .sort({ createdAt: -1 })

    res.json({
      success: true,
      reading
    })
  },

  getLatestReadingsForSensors: async (req, res) => {
    const readings = await Reading
      .aggregate([
        {
          $group: {
            _id: 'sensorId',
          }
        },
        {
          $sort: { createdAt: -1 }
        },
        {
          $limit: 1
        }
      ])

      console.log(readings);

    res.json({
      success: true,
      readings
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
