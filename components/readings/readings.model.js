const mongoose = require('mongoose')
const Schema = mongoose.Schema

const readingSchema = new mongoose.Schema({
  temperature: { type: Number, required: true },
  sensor: { type: String, required: true },
  created: { type: Date, required: true },
})

module.exports = mongoose.model('Reading', readingSchema)

