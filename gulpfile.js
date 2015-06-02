var gulp = require( 'gulp' ),
	usemin = require( 'gulp-usemin' ),
	uglify = require( 'gulp-uglify' ),
	minifyCss = require( 'gulp-minify-css' ),
	chmod = require( 'gulp-chmod' ),
	gulpFilter = require('gulp-filter'),
	del = require( 'del' );

gulp.task( 'default', [ 'clean' ], function(){
	gulp.src( 'index.html' )
		.pipe( usemin({
			assetsDir : '',
			css : [ minifyCss(), 'concat' ],
			js : [ uglify(), 'concat' ]
		}))
		.pipe( gulp.dest( 'public/' ) )

	gulp.src( 'csv/*' )
    	.pipe( chmod( 666 ) )
		.pipe( gulp.dest( 'public/csv' ) );
	
	gulp.src( 'img/*' )
		.pipe( gulp.dest( 'public/img' ) );
		
  var filter = gulpFilter( ['*', '!cache' ] );
  
  gulp.src( 'php/*' )
    .pipe( filter )
		.pipe( gulp.dest( 'public/php' ) );
    	
	gulp.src( 'bower_components/fontawesome/fonts/*' )
		.pipe( gulp.dest( 'public/fonts' ) );
		
  gulp.src( 'tiles/**/*' )
		.pipe( gulp.dest( 'public/tiles' ) );
});

gulp.task( 'clean', function( callback ){
    del( [ 'public/**/*' ], callback );
});
