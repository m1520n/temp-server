const mongoose = require('mongoose')
const Schema = mongoose.Schema

const readingSchema = new mongoose.Schema({
  temperature: { type: Number, required: true },
  sensor: { type: String, required: true },
  created: { type: Date, expires: 86400, default: Date.nowtype },
})

module.exports = mongoose.model('Reading', readingSchema)

