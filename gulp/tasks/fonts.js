var gulp 		= require('gulp');
var print 		= require('gulp-print');
var datapaths	= require("./datapaths");
var rimraf      = require('rimraf');

gulp.task('fonts', ['environmentCheck', 'clean_fonts'], function() 
{
    return gulp.src('./frontend/files/fonts/**/*.*')
	.pipe(print())
	.pipe(gulp.dest(global.outputDir + datapaths.dataPath + '/fonts'))
});

gulp.task('clean_fonts', function (cb) 
{
  	rimraf(global.outputDir + datapaths.dataPath + '/fonts', cb);
  	console.log('cleaning fonts...');
});