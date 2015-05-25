var gulp = require('gulp'),
	uglify = require('gulp-uglify'),
	insert = require('gulp-insert'),
	webpack = require('gulp-webpack')
;

var packageName = 'react-json';
var pack = require( './package.json' );

var getWPConfig = function( filename ){
	return {
		externals: {
			react: {
				root: 'React'
			}
		},
		output: {
			libraryTarget: 'umd',
			library: 'Json',
			filename: filename + '.js'
		}
	};
};

var cr = ('/*\n%%name%% v%%version%%\n%%homepage%%\n%%license%%: https://github.com/arqex/' + packageName + '/raw/master/LICENSE\n*/\n')
	.replace( '%%name%%', pack.name)
	.replace( '%%version%%', pack.version)
	.replace( '%%license%%', pack.license)
	.replace( '%%homepage%%', pack.homepage)
;

function wp( config, minify ){
	var stream =  gulp.src('./Json.js')
		.pipe( webpack( config ) )
	;

	if( minify ){
		stream.pipe( uglify() );
	}

	return stream.pipe( insert.prepend( cr ) )
		.pipe( gulp.dest('build/') )
	;
}

gulp.task("build", function( callback ) {
	var config = getWPConfig( 'Json' );
	config.devtool = '#eval';
	wp( config );

	config = getWPConfig( 'Json.min' );
	wp( config, true );

	config = getWPConfig( 'Json-no-freezer' );
	config.devtool = '#eval';
	config.externals['freezer-js'] = { root: 'Freezer' };
	wp( config );

	config = getWPConfig( 'Json-no-freezer.min' );
	config.externals['freezer-js'] = { root: 'Freezer' };
	return wp( config, true );
});

gulp.task( 'default', ['build'] );
