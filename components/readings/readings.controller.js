const Reading = require('./readings.model')

module.exports = {
  getReadings: async (req, res) => {
    const { limit } = req.query;
    const sensors = await Reading
      .aggregate([
        {
          $group: {
            _id: '$sensorId',
            readings: {
              $push: {
                temperature: '$temperature',
                createdAt: '$createdAt',
              },
            },
          },
        },
        {
          $sort: { 'readings.createdAt': 1 }
        },
        {
          $project: {
            _id: 0,
            sensor: '$_id',
            readings: {
              $slice: ['$readings', 0, limit || 50]
            },
          },
        }
      ])

    res.json({
      success: true,
      sensors,
      count: sensors.length,
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
            _id: '$sensorId',
            sensor: { $last: '$sensor' },
            temperature: { $last: '$temperature' },
            date: { $last: '$createdAt' },
          },
        },
        {
          $sort: { createdAt: -1 }
        },
      ])

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
