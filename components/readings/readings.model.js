const mongoose = require('mongoose')
const Schema = mongoose.Schema

const readingSchema = new mongoose.Schema({
  temperature: { type: Number, required: true },
  sensor: { type: String, required: true },
  createdAt: { type: Date, expires: 86400000, default: Date.now },
})

module.exports = mongoose.model('Reading', readingSchema)

