"use strict";

var fs = require( 'fs' ),
		gulp = require( 'gulp' ),
		rollup = require( 'gulp-better-rollup' ),
		eslint = require( 'rollup-plugin-eslint' ),
		babel = require( 'rollup-plugin-babel' ),
		cjs = require( 'rollup-plugin-commonjs' ),
		uglify = require( 'rollup-plugin-uglify' ),
		fileOverride = require( 'gulp-file-override' ),
		sass = require( 'gulp-sass' ),
		concat = require( 'gulp-concat' ),
		merge = require( 'deepmerge' ),
		//extend = require( 'gulp-multi-extend' ),
		rename = require( 'gulp-rename' ),
		sourcemaps = require( 'gulp-sourcemaps' ),
		browserSync = require( 'browser-sync' ).create();

var CONFIG = JSON.parse( fs.readFileSync( './src/course/config.json' ) ),
		eslintOptions = {
			exclude: 'node_modules/**',
			parserOptions: {
				ecmaVersion: 6,
				sourceType: 'module',
				ecmaFeatures: {
					impliedStrict: false
				}
			},
			rules: {
				'eqeqeq': 2,
				'no-inner-declarations': 2,
				'no-irregular-whitespace': 1,
				'valid-jsdoc': 1,
				'no-dupe-keys': 1,
				'valid-typeof': 2,
				'no-unreachable': 2,
				'no-alert': 2,
				'no-eval': 2,
				'quotes': ['warn', 'single']
			},
			envs: ['browser']
		},
		timestamp = function() {
			return new Date().getTime();
		},
		arrayMerge = ( destinationArray, sourceArray, options ) => {
			let arrayOut = Array.isArray( destinationArray ) ? [] : {};

			// console.log( '==================================================================================' );

			for( let index in destinationArray ) {
				if( sourceArray[index] ) {
					// console.log( 'TYPE        ', typeof destinationArray[index] );
					// console.log( 'INITIAL     ', destinationArray[index] );
					// console.log( 'MERGE       ', sourceArray[index] );

					if( typeof sourceArray[index] === 'object' ) {
						// console.log( 'OBJECT - MERGE' );
						arrayOut[index] = arrayMerge( destinationArray[index], sourceArray[index], options );
					} else {
						// console.log( 'NON OBJECT - REPLACE' );
						arrayOut[index] = sourceArray[index];
					}

					// console.log( 'FINAL       ', arrayOut[index] );
				} else {
					// console.log( 'UNIQUE TO INITIAL ', destinationArray[index] );
					arrayOut[index] = destinationArray[index];
				}
			}

			// console.log( 'FULL INITIAL', destinationArray );
			// console.log( 'FULL MERGE  ', sourceArray );
			// console.log( 'FINAL FINAL ', arrayOut );

			// console.log( '' );
			// console.log( '' );
			// console.log( '' );

			return arrayOut;

		};

gulp.task( 'index', () => {
	return gulp.src( './src/core/index.html' )
			.pipe( gulp.dest( './build' ) );
} );

gulp.task( 'js', () => {
	gulp.src( './src/core/js/app.js' )
			.pipe( fileOverride( 'core/js/*', 'app/core/js/$1' ) )
			.pipe( sourcemaps.init() )
			.pipe( rollup( {
				plugins: [
					/*eslint( eslintOptions ),*/
					cjs(),
					babel( {
						presets: [['es2015', {'modules': false}]],
						sourceMaps: true,
						exclude: 'node_modules/**',
						babelrc: false
					} ),
					//uglify()
				]
			}, {
				format: 'iife'
			} ) )
			.pipe( rename( 'morsels.min.js' ) )
			.pipe( sourcemaps.write( '' ) )
			.pipe( gulp.dest( './build/js' ) );
} );

gulp.task( 'data', ['index'], () => {
	CONFIG = JSON.parse( fs.readFileSync( './src/course/config.json' ) );

	var COURSE = {
		config: CONFIG,
		content: {}
	};

	let courseContentFiles = './src/course/content/',
			defaultLanguage = COURSE.config.languages.primary,
			defaultLanguageContent = fs.readFileSync( courseContentFiles + defaultLanguage + '.json' ) || '{}';

	COURSE.content[defaultLanguage] = JSON.parse( defaultLanguageContent );

	fs.readdirSync( courseContentFiles )
			.forEach( languageContentFile => {
				if( languageContentFile !== defaultLanguage + '.json' ) {
					let language = languageContentFile.replace( /.json$/, '' ),
							languageContent = fs.readFileSync( courseContentFiles + languageContentFile ) || '{}';

					COURSE.content[language] = merge( JSON.parse( defaultLanguageContent ), JSON.parse( languageContent ), {arrayMerge: arrayMerge} );
				}
			} );

	fs.writeFileSync( './build/course.json', JSON.stringify( COURSE ) );
} );

gulp.task( 'scss', () => {
	return gulp.src( [
		'./src/core/sass/base.scss',
		'./src/activities/**/*.scss',
		'./src/cards/**/*.scss',
		'./src/extensions/**/*.scss'
	] )
			.pipe( fileOverride( 'core/sass', 'app/core/sass' ) )
			.pipe( fileOverride( 'activities/*/sass', 'app/activities/$1/sass' ) )
			.pipe( fileOverride( 'cards/*/sass', 'app/cards/$1/sass' ) )
			.pipe( fileOverride( 'extensions/*/sass', 'app/extensions/$1/sass' ) )
			.pipe( sourcemaps.init() )
			.pipe( sass( {outputStyle: 'compressed'} )
					.on( 'error', err => {
						sass.logError( err );
						this.emit( 'end' );
					} )
			)
			.pipe( concat( 'course.min.css' ) )
			.pipe( sourcemaps.write( './' ) )
			.pipe( gulp.dest( './build/css' ) )
			.pipe( browserSync.stream( {match: '**/*.css'} ) );
} );

gulp.task( 'resources', () => {
	return gulp.src( './src/course/resources/**/*' )
			.pipe( gulp.dest( './build/resources' ) );
} );

gulp.task( 'cards', () => {
	return gulp.src( './src/cards/*/js/**/*.js' )
			.pipe( fileOverride( 'cards/*/js', 'app/cards/$1/js' ) )
			.pipe( sourcemaps.init() )
			.pipe( rollup( {
				plugins: [
					/*eslint( eslintOptions ),*/
					cjs(),
					babel( {
						presets: [['es2015', {'modules': false}]],
						sourceMaps: true,
						exclude: 'node_modules/**',
						babelrc: false
					} ),
					//uglify()
				]
			}, {
				format: 'es'
			} ) )
			.pipe( concat( 'cards.min.js' ) )
			.pipe( sourcemaps.write( '' ) )
			.pipe( gulp.dest( './build/js' ) );
} );

gulp.task( 'activities', () => {
	return gulp.src( './src/activities/*/js/**/*.js' )
			.pipe( fileOverride( 'activities/*/js', 'app/activities/$1/js' ) )
			.pipe( sourcemaps.init() )
			.pipe( rollup( {
				plugins: [
					/*eslint( eslintOptions ),*/
					cjs(),
					babel( {
						presets: [['es2015', {'modules': false}]],
						sourceMaps: true,
						exclude: 'node_modules/**',
						babelrc: false
					} ),
					//uglify()
				]
			}, {
				format: 'es'
			} ) )
			.pipe( concat( 'activities.min.js' ) )
			.pipe( sourcemaps.write( '' ) )
			.pipe( gulp.dest( './build/js' ) );
} );

// gulp.task( 'resources', () => {
// 	return gulp.src( './src/course/resources/**/*' )
// 		.pipe( gulp.dest( './build/app/resources' ) );
// } );

// gulp.task( 'lms', ['lms:scorm', 'lms:xapi'] );
//
// gulp.task( 'lms:scorm', ['lms:scorm:wrapper', 'lms:scorm:definitions'] );
//
// gulp.task( 'lms:scorm:wrapper', () => {
// 	return gulp.src( './src/core/lms/scorm/SCORM_API_wrapper.js' )
// 		.pipe( gulp.dest( './build/lms/scorm' ) );
// } );
//
// gulp.task( 'lms:scorm:definitions', () => {
// 	if( COURSE.lms &&
// 		COURSE.lms.scorm &&
// 		COURSE.lms.scorm.enable &&
// 		COURSE.lms.scorm.version ) {
// 		gulp.src( './src/core/lms/scorm/definitions/' + COURSE.lms.scorm.version + '/imsmanifest.xml' )
// 			.pipe(
// 				xmlpoke(
// 					{
// 						replacements: [
// 							{
// 								xpath: '//ims:organizations/organization/title',
// 								namespaces: {
// 									'ims': 'http://www.imsproject.org/xsd/imscp_rootv1p1p2'
// 								},
// 								value: 'TEST'
// 							}
// 						]
// 					}
// 				)
// 			)
// 			/*.pipe(
// 			 addsrc(
// 			 [
// 			 './src/core/lms/scorm/definitions/' + COURSE.lms.scorm.version + '/*',
// 			 '!./src/core/lms/scorm/definitions/' + COURSE.lms.scorm.version + '/imsmanifest.xml'
// 			 ]
// 			 )
// 			 )*/
// 			.pipe( gulp.dest( './build' ) );
// 	}
// } );
//
// gulp.task( 'lms:xapi', () => {
// 	//
// } );
//
// gulp.task( 'docs', () => {
// 	gulp.src( './src/core/js/**/*.js' )
// 		.pipe( jsdoc( { opts: { destination: './docs/core/' } } ) );
// } );
//
// gulp.task( 'archive', () => {
// 	// let now = timestamp();
// 	//
// 	// gulp.src( './src/course/**/*' )
// 	// 	.pipe( gulp.dest( './archive/' + now + '/course' ) );
// 	// return gulp.src( './src/app/**/*' )
// 	// 	.pipe( gulp.dest( './archive/' + now + '/app' ) );
// } );
//
// gulp.task( 'new', ['archive'], () => {
// 	// del(
// 	// 	[
// 	// 		'./src/course/**/*',
// 	// 		'./src/app/**/*'
// 	// 	]
// 	// ).then( () => {
// 	// 	gulp.src( './src/resources/default-course.json' )
// 	// 		.pipe( rename( 'en.json' ) )
// 	// 		.pipe( gulp.dest( './src/course' ) );
// 	//
// 	// 	gulp.src( './src/resources/default-config.json' )
// 	// 		.pipe( rename( 'config.json' ) )
// 	// 		.pipe( gulp.dest( './src/app' ) );
// 	// } );
// } );
//
// gulp.task( 'clean', () => {
// 	return del(
// 		['./build/**/*']
// 	);
// } );

gulp.task( 'service-worker', () => {
	gulp.src( './src/core/js/sw.js' )
			.pipe( gulp.dest( './build' ) );
} );

gulp.task( 'manifest', ['index'], () => {
	var manifestJSON = {
		short_name: CONFIG.appShortName || 'Morsels',
		name: CONFIG.appName || 'Morsels',
		theme_color: CONFIG.appThemeColour || '#29B6F6',
		background_color: CONFIG.appBackgroundColour || '#0288D1',
		display: 'fullscreen',
		orientation: 'portrait',
		icons: [],
		// 'start_url': './',
		// 'dir': 'ltr',
		// 'lang': 'en-GB'
	};

	for( var size in CONFIG.appIcons ) {
		var iconURI = CONFIG.appIcons[size];
		manifestJSON.icons.push( {

			src: './' + CONFIG.appIcons[size],
			type: 'image/' + CONFIG.appIcons[size].split( '.' ).pop(),
			sizes: size + 'x' + size
		} );
	}

	fs.writeFileSync( './build/manifest.json', JSON.stringify( manifestJSON ) );
} );

gulp.task( 'dev', ['build', 'serve'] );

gulp.task( 'serve', () => {
	browserSync.init(
			{
				files: [
					'./build/css/*.css',
					'./build/js/*.js'
				],
				server: {
					baseDir: './build',
					directory: false,
					index: 'index.html',
					logLevel: 'debug'
				},
				open: false
			}
	);

	gulp.watch( './src/core/index.html', ['index'] ).on( 'change', browserSync.reload );
	gulp.watch( './src/**/*.js', ['js'] ).on( 'change', browserSync.reload );
	gulp.watch( './src/cards/*/js/**/*.js', ['cards'] ).on( 'change', browserSync.reload );
	gulp.watch( './src/activities/*/js/**/*.js', ['activities'] ).on( 'change', browserSync.reload );
	gulp.watch( './src/**/*.scss', ['scss'] );
	gulp.watch( ['./src/course/config.json'], ['data', 'manifest'] ).on( 'change', browserSync.reload );
	gulp.watch( ['./src/course/content/*.json'], ['data'] ).on( 'change', browserSync.reload );
} );

gulp.task( 'build', ['index', 'js', 'cards', 'activities', 'scss', 'data', 'resources', 'service-worker', 'manifest'] );

// gulp.task( 'package', ['build'], () => {
// 	return gulp.src( './build/**/*' )
// 		.pipe( zip( 'scorm-package-' + timestamp() + '.zip' ) )
// 		.pipe( gulp.dest( './scorm-packages' ) );
// } );
