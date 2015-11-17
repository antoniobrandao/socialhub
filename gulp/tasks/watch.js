var gulp 		= require('gulp');
var runSequence = require('run-sequence');
var reload 		= require('browser-sync').reload;

gulp.task('watch', ['setDevelopment'], function() 
{
    // runSequence('js_watch', 'stylus', 'nodemon');
    runSequence('js_watch', 'stylus', 'browserSync', 'start');

	gulp.watch('frontend/stylus/*.*', ['stylus']);
	gulp.watch('builds/development/resources/js/*.*', reload);
});

gulp.task('start', function() 
{
	console.log('')
    console.log('::::::::::::::::::::::::::::::')
	console.log(':::::::::: watching ::::::::::')
	console.log('::::::::::::::::::::::::::::::')
	console.log('')
	console.log('Press CTRL-C twice to exit.')
	console.log('')
});