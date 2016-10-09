'use strict';

module.exports = function() {
  const SERVER = './';
  const PUBLIC_DIR = './public/';
  const BUILD = './build/';
  const BUILD_FONTS = BUILD + 'fonts/';
  const BUILD_IMAGES = BUILD + 'images/';
  const FONTS = PUBLIC_DIR + 'bower_components/font-awesome/fonts/**/*.*';
  const HTML_TEMPLATES = PUBLIC_DIR + '**/*.html';
  const IMAGES = PUBLIC_DIR + './images/**/*.*';
  const TEMP = './tmp'; //I have no templates, components at the moment so it woll be not used

  let config = {
    /**
    * File paths
    **/
    alljs: [
      './*.js',
      './config/*.js',
      './controllers/',
      './middleware/',
      './models/',
      './routes/*.js',
      './public/*.js',
      './public/controllers/*.js',
      './public/services/*.js',
    ],
    build: BUILD,
    buildFonts: BUILD_FONTS,
    buildImages: BUILD_IMAGES,
    css: PUBLIC_DIR + 'styles/style.css',
    fonts: FONTS,
    htmlTemplates: HTML_TEMPLATES,
    index: PUBLIC_DIR + 'index.html',
    images: IMAGES,
    js: [
      PUBLIC_DIR + '**/*.js',
      '!' + PUBLIC_DIR + 'bower_components/**/*.js'
    ],
    less: PUBLIC_DIR + 'styles/style.less',
    style: PUBLIC_DIR + '/styles/',
    publicDir: PUBLIC_DIR,
    server: SERVER,
    temp: TEMP,

    /**
    * template chache
    **/
    templateCache: {
      file: 'templates.js',
      options: {
        module: 'myApp',
        standAlone: false,
        root: './public/'
      }
    },

    /**
    * Bower and npm locations
    **/
    bower: {
      json: require('./bower.json'),
      directory: PUBLIC_DIR + 'bower_components/',
      ignorePath: '../..'
    },

    /**
    * Node settings
    **/
    defaultPort: 8000,
    nodeServer: SERVER,
    /**
    * Browser sync
    **/
    browserReloadDelay: 1000
  };

  config.getWiredepDefaultOptions = () => {
      return {
        bowerJson: config.bower.json,
        directory: config.bower.directory,
        ignorePath: config.bower.ignorePath
      };
  };

  return config;
};
