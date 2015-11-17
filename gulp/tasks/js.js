var gulp          = require('gulp');
var browserify    = require('browserify');
var source        = require('vinyl-source-stream');
var browserify    = require('browserify');
var gulpif        = require('gulp-if');
var connect       = require('gulp-connect');
var streamify     = require('gulp-streamify');
var uglify        = require('gulp-uglify');

var watchify      = require('watchify');
var bundleLogger  = require('../util/bundleLogger');
var handleErrors  = require('../util/handleErrors');
var strip         = require('gulp-strip-debug');
var print         = require("gulp-print");
var datapaths     = require("./datapaths"); 

gulp.task('js_watch', ['environmentCheck'], function()
{
  var bundle = function()
  {
    return bundler.bundle()
      .on('start', bundleLogger.start)
      .on('error', handleErrors)
      .pipe(source('bundle.js'))
      // remove console.logs and such
      .pipe(gulpif( global.ENV === 'production', streamify( strip() )))
      // uglify JS and obfuscate in produciton mode only
      .pipe(gulpif( global.ENV === 'production', streamify(uglify({ mangle: global.ENV === 'production' }))))
      .pipe(print())
      .pipe(gulp.dest(global.outputDir + datapaths.dataPath + '/js'))
      // .pipe(connect.reload())
      .on('end', bundleLogger.end);
  }

  var browserify_instance = browserify({
    cache: {}, packageCache: {}, fullPaths: true,
    entries:    ['./frontend/js/index.js'],
    extensions: ['.jade', '.styl'],
    debug:      global.ENV === 'development'
  });

  var bundler = watchify(browserify_instance);
  bundler.on('update', bundle); // on any dep update, runs the bundler

  bundle();
});



gulp.task('js_build', ['environmentCheck'], function() {

  console.log('GULP: Starting js task');
  
  var browserify_instance = browserify(
  {
    cache: {}, packageCache: {}, fullPaths: true,
    entries:    ['./frontend/js/index.js'],
    extensions: ['.jade', '.styl'],
    debug:      global.ENV === 'development'
  });

  var bundle = function() 
  {
    bundleLogger.start();

    return browserify_instance
      .bundle()
      .on('error', handleErrors)
      .pipe(source('bundle.js'))
      // remove console.logs and such
      .pipe(gulpif( global.ENV === 'production', streamify( strip() )))
      // uglify JS and obfuscate in produciton mode only
      .pipe(gulpif( global.ENV === 'production', streamify(uglify({ mangle: global.ENV === 'production' }))))
      .pipe(print())
      .pipe(gulp.dest(global.outputDir + datapaths.dataPath + '/js'))
      // .pipe(connect.reload())
      .on('end', bundleLogger.end);
  };

  return bundle();
});

gulp.task('js_prod', ['setProduction'], function() 
{
  gulp.start('js_build');
});
