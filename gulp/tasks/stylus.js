var gulp         	= require('gulp');
var handleErrors 	= require('../util/handleErrors');
var changed		 	= require("gulp-changed");
var plumber		 	= require("gulp-plumber");
var	gulpif 		    = require('gulp-if');
var print           = require('gulp-print');

var stylus		 	= require("gulp-stylus");
var jeet		 	= require("jeet");
var rupture	 	 	= require("rupture");
var datapaths	 	= require("./datapaths");

gulp.task('stylus', ['environmentCheck'], function () 
{  
	gulp.src( datapaths.cssSrcPath )
	.pipe( plumber( handleErrors ) )
	.pipe(stylus({ 
		compress: global.ENV === 'production',
		use:[	
				jeet(),
				rupture(), 
			],
			sourcemap: { inline: global.ENV === 'development' } 
	}))
	.pipe(print())
	.pipe(gulp.dest(global.outputDir + datapaths.dataPath + '/css'));
});

gulp.task('stylus_dev', ['setDevelopment'], function () 
{  
	gulp.src( datapaths.cssSrcPath )
	.pipe( plumber( handleErrors ) )
	.pipe(stylus({
		compress: false,
		use:[	
				jeet(),
				rupture(), 
			],
			sourcemap: { inline: true } 
	}))
    .pipe(print())
	.pipe(gulp.dest(global.outputDir + datapaths.dataPath + '/css'));
});

gulp.task('stylus_prod', ['setProduction'], function () 
{  
	gulp.src( datapaths.cssSrcPath )
	.pipe( plumber( handleErrors ) )
	.pipe(stylus({
		compress: true,
		use:[
				jeet(),
				rupture(), 
			]
	}))
	.pipe(print())
	.pipe(gulp.dest(global.outputDir + datapaths.dataPath + '/css'));
});