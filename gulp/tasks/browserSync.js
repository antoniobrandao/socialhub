var browserSync = require('browser-sync');
var gulp        = require('gulp');
var nodemon     = require('gulp-nodemon');
var reload 		= browserSync.reload;

gulp.task('browserSync', ['nodemon'], function() {
  browserSync.init([global.outputDir + '/**'], {
	open: false,
    proxy: "localhost:5000",  // local node app address
    port: 3000,  // use *different* port than above
    notify: true
  });
});

gulp.task('nodemon', function (cb) {
  var called = false;
  return nodemon({
    script: 'express/server.js',
    watch: [
      'express/',
      // 'builds/',
    ]
  })
  .on('start', function () {
    if (!called) {
      called = true;
      cb();
    }
  })
  .on('restart', function () {
    setTimeout(function () {
      reload({ stream: false });
    }, 3000);
  });
});


// gulp.task('demon', function () {
//   nodemon({
//     script: 'express/server.js',
//     ext: 'js',
//     env: {
//       'NODE_ENV': 'development'
//     }
//   })
//     .on('start', ['watch'])
//     .on('change', ['watch'])
//     .on('restart', function () {
//       console.log('restarted!');
//     });
// });

// gulp.task('browser-sync', ['nodemon'], function() {
//   browserSync.init(null, {
//     proxy: "http://localhost:5000",
//         files: ["public/**/*.*"],
//         browser: "google chrome",
//         port: 7000,
//   });
// });
// gulp.task('nodemon', function (cb) {
  
//   var started = false;
  
//   return nodemon({
//     script: 'app.js'
//   }).on('start', function () {
//     // to avoid nodemon being started multiple times
//     if (!started) {
//       cb();
//       started = true; 
//     } 
//   });
// });