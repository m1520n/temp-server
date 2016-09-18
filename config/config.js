'use strict';

var config = {
  local: {
    mode: 'local',
    port: 3001,
    mongo: {
      host : '0.0.0.0',
      port: 32768,
      db: 'local'
    }
  },
  staging : {
    mode: 'staging',
    port: 3002,
    mongo: {
      host : '0.0.0.0',
      port: 32768,
      db: 'stage'
    }
  },
  production : {
    mode: 'production',
    port: 8080,
    mongo: {
      host : 'meantools:meanpass123!@ds013250.mlab.com',
      port: 13250,
      db: 'heroku_n570m075'
    }
  }
};

module.exports = function(mode) {
    return config[mode || process.argv[2] || 'local'] || config.local;
};
