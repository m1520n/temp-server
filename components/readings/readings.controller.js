const Reading = require('./readings.model')

module.exports = {
  getReadings: async (req, res) => {
    const { limit } = req.query;
    const readings = await Reading
      .aggregate([
        {
          $sort: { createdAt: -1 }
        },
        {
          $group: {
            _id: '$sensorId',
            readings: { $push: '$ROOT' },
          },
        },
        {
          $project: {
            _id: null,
            sensor: '$sensorId',
            readings: {
              $slice: ['$temperature', 0, limit || 50]
            },
          },
        },
      .find({})
      .sort({ createdAt: -1 })
      .limit((limit && parseInt(limit)) || 0)

      $group: {
        _id: null, // group everything into one single bucket
        docs: { $push: "$$ROOT" } // push all documents into an array (this will be massive for huge collections...)
    }
}, {
    $project: {
        "docsTop10": { $slice: [ "$docs", 10 ] }, // take the first 10 elements from the ASC sorted array
        "docsBottom10": { $reverseArray: { $slice: [ "$docs", -10 ] } } // take the last 10 elements from the array but reverse their order
    }
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
          $sort: { createdAt: -1 }
        },
        {
          $group: {
            _id: '$sensorId',
            sensor: { $last: '$sensor' },
            temperature: { $last: '$temperature' },
            date: { $last: '$createdAt' },
          },
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
