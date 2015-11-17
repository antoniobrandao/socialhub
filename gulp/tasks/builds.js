var gulp 		= require('gulp');
var runSequence = require('run-sequence');

gulp.task('build_dev', ['setDevelopment'], function() 
{
    runSequence('clean', 'fonts', 'stylus', 'js_build');
});

gulp.task('build', ['setProduction'], function() 
{
    runSequence('clean', 'fonts', 'stylus', 'js_build');
});