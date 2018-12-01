module.exports = {
  DATABASE_URI: {
    dev: 'localhost:27017/temperature-local',
    prod: 'localhost:27017/temperature-production',
    test: 'localhost:27017/temperature-test'
  },
  PORT: process.env.PORT || 3001,
}
