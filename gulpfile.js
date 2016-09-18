'use strict';

let gulp = require('gulp');
let args = require('yargs').argv;
let del = require('del');
let browserSync = require('browser-sync');

let config = require('./gulp.config')();
let port = process.env.PORT || config.defaultPort;

let $ = require('gulp-load-plugins')({lazy: true});

function log(msg) {
  if (typeof(msg) === 'object') {
    for (let item in msg) {
      if (msg.hasOwnProperty(item)) {
        $.util.log($.util.colors.blue(msg[item]));
      }
    }
  } else {
    $.util.log($.util.colors.blue(msg));
  }
}

function clean(path, done) {
  log('Cleaning:' + $.util.colors.blue(path));
  del(path, done());
}

function changeEvent(event) {
  let srcPattern = new RegExp('/.*(?=/' + config.source + ')/');
  log('File ' + event.path.replace(srcPattern, '') + ' ' + event.type);
}

function startBrowserSync() {
  if (args.nosync || browserSync.active) {
    return;
  }

  log('Starting browser-sync on port ' + port);

  gulp.watch([config.less], ['styles'])
    .on('change', (event) => {
      changeEvent(event);
    });
  let options = {
    proxy: 'localhost:' + port,
    port: 3000,
    files: [
      config.publicDir + '**/*.*',
      '!' + config.less
    ],
    ghostMode: {
      clicksource: true,
      location: false,
      forms: true,
      scroll: true
    },
    injectChanges: true,
    logFileChanges: true,
    logLevel: 'debug',
    logPrefix: 'temp-server',
    notify: 'true',
    reloadDelay: 1000
  };
  browserSync(options);
}

gulp.task('help', $.taskListing);

gulp.task('default', ['help']);

gulp.task('fonts', ['clean-fonts'], () => {
  log('Copying fonts');

  return gulp
    .src(config.fonts)
    .pipe(gulp.dest(config.buildFonts));
});

gulp.task('images', ['clean-images'], () => {
  log('Copying and comressing the images');

  return gulp
    .src(config.images)
    .pipe($.imagemin({optimizationLevel: 4}))
    .pipe(gulp.dest(config.buildImages));
});

gulp.task('lint', () => {
  log('Analyzing source with JSHint and JSCS');

  return gulp
    .src(config.alljs)
    .pipe($.if(args.verbose, $.print()))
    .pipe($.jscs())
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish', {verbose: true}))
    .pipe($.jshint.reporter('fail'));
});

gulp.task('styles', ['clean-styles'], () => {
  log('Compiling Less to CSS');

  return gulp
    .src(config.less)
    .pipe($.plumber())
    .pipe($.less())
    .pipe($.autoprefixer({browsers: ['last 2 version', '> 5%']}))
    .pipe(gulp.dest(config.style));
});

gulp.task('clean', (done) => {
  let delConfig = [].concat(config.build, config.css);
  log('Cleaning: ' + $.util.colors.blue(delConfig));
  del(delConfig, done);
});

gulp.task('templatecache', ['clean-code'], () => {
  log('Creating AngularJS $templatecache');

  return gulp
    .src(config.htmlTemplates)
    //.pipe($.minify({empty: true}))
    .pipe($.angularTemplatecache(
      config.templateCache.file,
      config.templateCache.options
    ))
    .pipe(gulp.dest(config.temp));

});

gulp.task('clean-code', (done) => {
  let files = [].concat(
    config.build + '**/*.html',
    config.build + 'js/**/*.js'
  );
  clean(files, done);
});

gulp.task('clean-fonts', (done) => {
  let files = config.buildFonts + '**/*.*';
  clean(files, done);
});

gulp.task('clean-images', (done) => {
  let files = config.buildImages + '**/*.*';
  clean(files, done);
});

gulp.task('clean-styles', (done) => {
  let files = config.build + '**/*.css';
  clean(files, done);
});

gulp.task('less-watcher', () => {
  gulp.watch([config.less], ['styles']);
});

gulp.task('wiredep', () => {
  log('Wire up the bower css js and our app js into html');
  let options = config.getWiredepDefaultOptions();
  let wiredep = require('wiredep').stream;

  return gulp
    .src(config.index)
    .pipe(wiredep(options))
    .pipe($.inject(gulp.src(config.js)))
    .pipe(gulp.dest(config.publicDir));
});

gulp.task('inject', ['wiredep', 'styles'], () => {
  log('Wire up the the app css into html, and call wiredep');
  return gulp
    .src(config.index)
    .pipe($.inject(gulp.src(config.css)))
    .pipe(gulp.dest(config.publicDir));
});

gulp.task('serve-dev', ['inject'], () => {
  let isDev = true;

  let nodeOptions = {
    script: config.nodeServer,
    delayTime: 1,
    env: {
      'PORT': port,
      'NODE_ENV': isDev ? 'dev' : 'build'
    },
    ignore: [
      '.node_modules/**',
      '.git',
      './public/bower_components'
    ],
    watch: [config.server]
  };
  return $.nodemon(nodeOptions)
    .on('restart', ['lint'], (evt) => {
      log('*** nodemon restared ***');
      log('* files changed on restart:\n' + evt);
      setTimeout(() => {
        browserSync.notify('reloading now...');
        browserSync.reload({stream: false});
      }, config.browserReloadDelay);
    })
    .on('start', () => {
      log('*** nodemon stared ***');
      startBrowserSync();
    })
    .on('crash', () => {
      log('*** nodemon crashed: script crashed for some reason ***');
    })
    .on('exit', () => {
      log('*** nodemon exited cleanly ***');
    });
});
