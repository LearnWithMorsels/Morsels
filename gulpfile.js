"use strict";

const fs = require( 'fs' ),
    path = require( 'path' ),
    gulp = require( 'gulp' ),
    del = require( 'del' ),
    zip = require( 'gulp-zip' ),
    rollup = require( 'gulp-better-rollup' ),
    eslint = require( 'rollup-plugin-eslint' ),
    babel = require( 'rollup-plugin-babel' ),
    cjs = require( 'rollup-plugin-commonjs' ),
    uglify = require( 'rollup-plugin-uglify' ),
    fileOverride = require( 'gulp-file-override' ),
    sass = require( 'gulp-sass' ),
    concat = require( 'gulp-concat' ),
    merge = require( 'deepmerge' ),
    insert = require( 'gulp-insert' ),
    rename = require( 'gulp-rename' ),
    jsdoc = require( 'gulp-jsdoc3' ),
    sourcemaps = require( 'gulp-sourcemaps' ),
    browserSync = require( 'browser-sync' ).create();

let CONFIG = JSON.parse( fs.readFileSync( './src/course/config.json' ) );

const eslintOptions = {
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
    arrayMerge = ( destinationArray, sourceArray, options ) => {
        let arrayOut = Array.isArray( destinationArray ) ? [] : {};

        for( let index in destinationArray ) {
            if( sourceArray[index] ) {
                if( typeof sourceArray[index] === 'object' ) {
                    arrayOut[index] = arrayMerge( destinationArray[index], sourceArray[index], options );
                } else {
                    arrayOut[index] = sourceArray[index];
                }
            } else {
                arrayOut[index] = destinationArray[index];
            }
        }

        return arrayOut;
    },
    walkSync = dir => fs.readdirSync( dir )
        .reduce( ( files, file ) =>
                fs.statSync( path.join( dir, file ) ).isDirectory() ?
                    files.concat( walkSync( path.join( dir, file ) ) ) :
                    files.concat( path.join( dir, file ) ),
            [] ),
    listResources = () => {
        let resources = walkSync( './src/course/resources' );
        for( let resource in resources ) {
            if( resources.hasOwnProperty( resource ) ) {
                resources[resource] = resources[resource].replace( 'src/course/resources', 'resources' );
            }
        }
        return resources;
    },
    slug = string => {
        return string.replace( /(^[ _\-]*|[ _\-]*$|[^a-z0-9\s\-_])/gi, '' ).replace( /\s/g, '-' ).replace( /\-{2,}/g, '-' ).toLowerCase();
    },
    padLeft = ( string, finalLength, padChar = ' ' ) => {
        string = string.toString();
        if( string.length < finalLength ) {
            for( let intChar = 0; intChar < finalLength; intChar++ ) {
                string = padChar + string;
            }
        }
        return string.slice( -finalLength );
    },
    numberSuffix = ( number, includeNumber ) => {
        if( typeof number !== 'number' ) {
            number = parseInt( number );
        }
        let suffix = '';
        if( typeof number === 'number'
            && number > 0 ) {
            let numberTensUnits = parseInt( number.toString().substr( -2 ) ),
                numberUnits = parseInt( number.toString().substr( -1 ) );

            if( numberUnits === 1
                || ( numberTensUnits > 10
                    && numberTensUnits !== 11 ) ) {
                suffix = 'st';
            } else if( numberUnits === 2
                || ( numberTensUnits > 10
                    && numberTensUnits !== 12 ) ) {
                suffix = 'nd';
            } else if( numberUnits === 3
                || ( numberTensUnits > 10
                    && numberTensUnits !== 13 ) ) {
                suffix = 'rd';
            } else {
                suffix = 'th';
            }
        }
        return ( includeNumber === true ) ? number + suffix : suffix;
    },
    date = ( format = '' ) => {
        let now = new Date(),
            words = {
                days: {
                    0: {
                        long: 'Sunday',
                        short: 'Sun'
                    },
                    1: {
                        long: 'Monday',
                        short: 'Mon'
                    },
                    2: {
                        long: 'Tuesday',
                        short: 'Tue'
                    },
                    3: {
                        long: 'Wednesday',
                        short: 'Wed'
                    },
                    4: {
                        long: 'Thursday',
                        short: 'Thu'
                    },
                    5: {
                        long: 'Friday',
                        short: 'Fri'
                    },
                    6: {
                        long: 'Saturday',
                        short: 'Sat'
                    }
                },
                months: {
                    1: {
                        long: 'January',
                        short: 'Jan'
                    },
                    2: {
                        long: 'February',
                        short: 'Feb'
                    },
                    3: {
                        long: 'March',
                        short: 'Mar'
                    },
                    4: {
                        long: 'April',
                        short: 'Apr'
                    },
                    5: {
                        long: 'May',
                        short: 'May'
                    },
                    6: {
                        long: 'June',
                        short: 'Jun'
                    },
                    7: {
                        long: 'July',
                        short: 'Jul'
                    },
                    8: {
                        long: 'August',
                        short: 'Aug'
                    },
                    9: {
                        long: 'September',
                        short: 'Sep'
                    },
                    10: {
                        long: 'October',
                        short: 'Oct'
                    },
                    11: {
                        long: 'November',
                        short: 'Nov'
                    },
                    12: {
                        long: 'December',
                        short: 'Dec'
                    }
                }
            },
            time = {
                N: now.getDay() % 7,
                j: now.getDate(),
                n: now.getMonth() + 1,
                Y: now.getFullYear(),
                G: now.getHours(),
                i: padLeft( now.getMinutes(), 2, '0' ),
                s: padLeft( now.getSeconds(), 2, '0' ),
                u: now.getMilliseconds(),
                U: Math.floor( now.getTime() / 1000 ),
                Z: now.getTimezoneOffset() * 3600
            };
        time.D = words.days[time.N]['short'],
            time.l = words.days[time.N]['long'],
            time.d = padLeft( time.j, 2, '0' ),
            time.S = numberSuffix( time.j ),
            time.m = padLeft( time.n, 2, '0' ),
            time.F = words.months[time.n]['long'],
            time.M = words.months[time.n]['short'],
            time.y = padLeft( time.Y, 2 ),
            time.H = padLeft( time.G, 2, '0' ),
            time.g = time.G === 0 ? 12 : ( time.G > 12 ? time.G - 12 : time.G ),
            time.h = padLeft( time.g, 2, '0' ),
            time.a = ( time.G < 12 ) ? 'am' : 'pm',
            time.A = time.a.toUpperCase(),
            time.L = ( time.Y % 4 === 0 && ( ( time.Y % 100 === 0 && time.Y % 400 === 0 ) || time.Y % 100 !== 0 ) ) ? 1 : 0;
        if( format !== '' ) {
            let out = '',
                char = 0;
            while( char < format.length ) {
                let strChar = format.charAt( char );
                if( strChar === '\\' ) {
                    char++;
                    out += format.substr( char, 1 );
                } else if( strChar === 'r' ) {
                    out += time.D + ', ' + time.j + ' ' + time.M + ' ' + time.Y + ' ' + time.H + ':' + time.i + ':' + time.s;
                } else if( strChar === 'x' ) {
                    out += time.Y + '-' + time.m + '-' + time.d + '\\T' + time.H + ':' + time.i + ':' + time.s + '\\Z';
                } else {
                    if( strChar !== ''
                        && time.hasOwnProperty( strChar ) ) {
                        out += time[strChar];
                    } else {
                        out += strChar;
                    }
                }
                char++;
            }
            return out;
        } else {
            return time;
        }
    };

gulp.task( 'index', ['scss:base'], () => {
    return gulp.src( './src/core/index.html' )
        .pipe( fileOverride( 'core/index.html', 'course/core/index.html' ) )
        .pipe( insert.transform( ( contents, file ) => {
            let iconMeta = '';

            for( let size in CONFIG.appIcons ) {
                if( CONFIG.appIcons.hasOwnProperty( size ) ) {
                    iconMeta += '<link rel="icon" sizes="' + size + 'x' + size + '" href="' + CONFIG.appIcons[size] + '">';
                }
            }

            return contents.replace( '</head>',
                '<style type="text/css">' + fs.readFileSync( './build/css/base.css' ) + '</style>' +
                '<meta name="theme-color" content="' + CONFIG.appThemeColour + '">' +
                '<meta name="apple-mobile-web-app-title" content="' + CONFIG.appShortName + '">' +
                '<meta name="msapplication-navbutton-color" content="' + CONFIG.appBackgroundColour + '">' +
                iconMeta +
                // <link rel="apple-touch-icon" sizes="57x57" href="/app/Resources/images/icons/icon-square-57.png">
                // <link rel="apple-touch-icon" sizes="152x152" href="/app/Resources/images/icons/icon-square-152.png">
                // <link rel="apple-touch-icon" sizes="167x167" href="/app/Resources/images/icons/icon-square-167.png">
                // <link rel="apple-touch-icon" sizes="180x180" href="/app/Resources/images/icons/icon-square-180.png">
                '</head>'
            );
        } ) )
        .pipe( gulp.dest( './build' ) );
} );

gulp.task( 'js', () => {
    gulp.src( './src/core/js/app.js' )
        .pipe( fileOverride( 'core/js/*', 'course/core/js/$1' ) )
        .pipe( sourcemaps.init() )
        .pipe( rollup( {
            plugins: [
                eslint( eslintOptions ),
                cjs(),
                babel( {
                    presets: [['es2015', { 'modules': false }]],
                    sourceMaps: true,
                    exclude: 'node_modules/**',
                    babelrc: false,
                    plugins: [
                        ['module-resolver', {
                            root: [
                                './src/course/core/js',
                                './src/course/core/js/components',
                                './src/course/core/js/partials',
                                './src/course/core/js/resources',
                                './src/core/js',
                                './src/core/js/components',
                                './src/core/js/partials',
                                './src/core/js/resources'
                            ]
                        }]
                    ]
                } ),
                uglify()
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
    let LANGUAGES = JSON.parse( fs.readFileSync( './src/core/resources/data/languages.json' ) );

    var COURSE = {
        config: CONFIG,
        languages: LANGUAGES,
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

                COURSE.content[language] = merge( JSON.parse( defaultLanguageContent ), JSON.parse( languageContent ), { arrayMerge: arrayMerge } );
            }
        } );

    fs.writeFileSync( './build/course.json', JSON.stringify( COURSE ) );
} );

gulp.task( 'scss', ['scss:base', 'scss:framework'] );

gulp.task( 'scss:base', () => {
    return gulp.src( './src/core/scss/base.scss' )
        .pipe( fileOverride( 'core/scss', 'course/core/scss' ) )
        .pipe( sourcemaps.init() )
        .pipe( sass( { outputStyle: 'compressed' } )
            .on( 'error', err => {
                sass.logError( err );
                this.emit( 'end' );
            } )
        )
        .pipe( sourcemaps.write( './' ) )
        .pipe( gulp.dest( './build/css' ) )
        .pipe( browserSync.stream( { match: '**/*.css' } ) );
} );

gulp.task( 'scss:framework', () => {
    return gulp.src( [
            './src/core/scss/morsels.scss',
            './src/activities/**/*.scss',
            './src/cards/**/*.scss',
            './src/components/**/*.scss'
        ] )
        .pipe( fileOverride( 'core/scss', 'course/core/scss' ) )
        .pipe( fileOverride( 'activities/*/scss', 'course/activities/$1/scss' ) )
        .pipe( fileOverride( 'cards/*/scss', 'course/cards/$1/scss' ) )
        .pipe( fileOverride( 'components/*/scss', 'course/components/$1/scss' ) )
        .pipe( sourcemaps.init() )
        .pipe( sass( { outputStyle: 'compressed' } )
            .on( 'error', err => {
                sass.logError( err );
                this.emit( 'end' );
            } )
        )
        .pipe( concat( 'morsels.min.css' ) )
        .pipe( sourcemaps.write( './' ) )
        .pipe( gulp.dest( './build/css' ) )
        .pipe( browserSync.stream( { match: '**/*.css' } ) );
} );

gulp.task( 'resources', ['resources:core', 'resources:course'] );

gulp.task( 'resources:core', () => {
    return gulp.src( './src/core/resources/**/*' )
        .pipe( fileOverride( 'core/resources/*', 'course/core/resources/$1' ) )
        .pipe( gulp.dest( './build/core' ) );
} );

gulp.task( 'resources:course', () => {
    return gulp.src( './src/course/resources/**/*' )
        .pipe( gulp.dest( './build/resources' ) );
} );

gulp.task( 'fonts', () => {
    return gulp.src( [
            './node_modules/material-design-icons/iconfont/MaterialIcons-Regular.eot',
            './node_modules/material-design-icons/iconfont/MaterialIcons-Regular.ttf',
            './node_modules/material-design-icons/iconfont/MaterialIcons-Regular.woff',
            './node_modules/material-design-icons/iconfont/MaterialIcons-Regular.woff2'
        ] )
        .pipe( gulp.dest( './build/css/fonts' ) );
} );

gulp.task( 'activities', () => {
    return gulp.src( './src/activities/*/js/*.js' )
        .pipe( fileOverride( 'activities/*/js', 'course/activities/$1/js' ) )
        .pipe( sourcemaps.init() )
        .pipe( rollup( {
            plugins: [
                eslint( eslintOptions ),
                cjs(),
                babel( {
                    presets: [['es2015', { 'modules': false }]],
                    sourceMaps: true,
                    exclude: 'node_modules/**',
                    babelrc: false,
                    plugins: [
                        ['module-resolver', {
                            root: [
                                './src/course/activities/*/js',
                                './src/activities/*/js'
                            ]
                        }]
                    ]
                } ),
                uglify()
            ]
        }, {
            format: 'es'
        } ) )
        .pipe( concat( 'activities.min.js' ) )
        .pipe( sourcemaps.write( '' ) )
        .pipe( gulp.dest( './build/js' ) );
} );

gulp.task( 'cards', () => {
    return gulp.src( './src/cards/*/js/*.js' )
        .pipe( fileOverride( 'cards/*/js', 'course/cards/$1/js' ) )
        .pipe( sourcemaps.init() )
        .pipe( rollup( {
            plugins: [
                eslint( eslintOptions ),
                cjs(),
                babel( {
                    presets: [['es2015', { 'modules': false }]],
                    sourceMaps: true,
                    exclude: 'node_modules/**',
                    babelrc: false,
                    plugins: [
                        ['module-resolver', {
                            root: [
                                './src/course/cards/*/js',
                                './src/cards/*/js'
                            ]
                        }]
                    ]
                } ),
                uglify()
            ]
        }, {
            format: 'es'
        } ) )
        .pipe( concat( 'cards.min.js' ) )
        .pipe( sourcemaps.write( '' ) )
        .pipe( gulp.dest( './build/js' ) );
} );

gulp.task( 'components', () => {
    return gulp.src( './src/components/*/js/*.js' )
        .pipe( fileOverride( 'components/*/js', 'course/components/$1/js' ) )
        .pipe( sourcemaps.init() )
        .pipe( rollup( {
            plugins: [
                eslint( eslintOptions ),
                cjs(),
                babel( {
                    presets: [['es2015', { 'modules': false }]],
                    sourceMaps: true,
                    exclude: 'node_modules/**',
                    babelrc: false,
                    plugins: [
                        ['module-resolver', {
                            root: [
                                './src/course/components/*/js',
                                './src/components/*/js'
                            ]
                        }]
                    ]
                } ),
                uglify()
            ]
        }, {
            format: 'es'
        } ) )
        .pipe( concat( 'components.min.js' ) )
        .pipe( sourcemaps.write( '' ) )
        .pipe( gulp.dest( './build/js' ) );
} );

gulp.task( 'archive', () => {
    let now = date( 'Y-m-d_H:i:s' );

    return gulp.src( './src/course/**/*' )
        .pipe( gulp.dest( './archive/' + now + '/course' ) );
} );

gulp.task( 'new', ['archive'], () => {
    del( './src/course/**/*' )
        .then( () => {
            gulp.src( './src/resources/default-course.json' )
                .pipe( rename( 'en.json' ) )
                .pipe( gulp.dest( './src/course' ) );

            gulp.src( './src/resources/default-config.json' )
                .pipe( rename( 'config.json' ) )
                .pipe( gulp.dest( './src/course' ) );
        } );
} );

gulp.task( 'clean', () => {
    return del( './build/**/*' );
} );

gulp.task( 'service-worker', ['data'], () => {
    gulp.src( './src/core/js/sw.js' )
        .pipe( insert.prepend( 'const TIMESTAMP = "' + date( 'U' ) + '";' ) )
        .pipe( insert.prepend( 'const RESOURCES = ' + JSON.stringify( listResources().concat( CONFIG.onlineResources || [] ) ) + ';' ) )
        .pipe( gulp.dest( './build' ) );
} );

gulp.task( 'manifest', ['index', 'data'], () => {
    var manifestJSON = {
        short_name: CONFIG.appShortName || 'Morsels',
        name: CONFIG.appName || 'Morsels',
        theme_color: CONFIG.appThemeColour || '#29B6F6',
        background_color: CONFIG.appBackgroundColour || '#0288D1',
        display: 'fullscreen',
        orientation: 'portrait',
        icons: [],
        start_url: './',
        // 'dir': 'ltr',
        // 'lang': 'en-GB'
    };

    for( let size in CONFIG.appIcons ) {
        if( CONFIG.appIcons.hasOwnProperty( size ) ) {
            let iconURI = CONFIG.appIcons[size];
            manifestJSON.icons.push( {
                src: './' + iconURI,
                type: 'image/' + iconURI.split( '.' ).pop(),
                sizes: size + 'x' + size
            } );
        }
    }

    fs.writeFileSync( './build/manifest.json', JSON.stringify( manifestJSON ) );
} );

gulp.task( 'export', ['default'], () => {
    return gulp.src( './build/**/*' )
        .pipe( zip( ( slug( CONFIG.appShortName ) || slug( CONFIG.appName ) || 'untitled-course' ) + '_' + date( 'Y-m-d_H:i:s' ) + '.zip' ) )
        .pipe( gulp.dest( './exports' ) );
} );

gulp.task( 'docs', ['docs:build'], () => {
    browserSync.init(
        {
            //files: [
            //    './docs/**/*.html'
            //],
            server: {
                baseDir: './docs',
                directory: false,
                index: 'index.html',
                logLevel: 'debug'
            },
            ui: false,
            ghostMode: false,
            notify: false
        }
    );

    gulp.watch( [
            './src/core/js/**/*.js',
            './src/activities/*/js/**/*.js',
            './src/cards/*/js/**/*.js',
            './src/components/*/js/**/*.js'
        ], ['docs:build'] )
        .on( 'change', browserSync.reload );
} );

gulp.task( 'docs:build', () => {
    return gulp.src( [
            './src/core/js/**/*.js',
            './src/activities/*/js/**/*.js',
            './src/cards/*/js/**/*.js',
            './src/components/*/js/**/*.js'
        ] )
        .pipe( jsdoc( {
            tags: {
                allowUnknownTags: true,
                dictionaries: ['jsdoc']
            },
            plugins: ['plugins/markdown'],
            templates: {
                cleverLinks: false,
                monospaceLinks: true,
                useLongnameInNav: false,
                showInheritedInNav: true
            },
            opts: {
                destination: './docs',
                encoding: 'utf8',
                readme: './README.md',
                //package: './package.json',
                //template: './node_modules/minami'
            }
        } ) );
} );

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
            ghostMode: false,
            open: false,
            notify: false
        }
    );

    gulp.watch( './src/core/index.html', ['index'] )
        .on( 'change', browserSync.reload );
    gulp.watch( './src/**/*.js', ['js'] )
        .on( 'change', browserSync.reload );
    gulp.watch( './src/core/js/sw.js', ['service-worker'] )
        .on( 'change', browserSync.reload );

    gulp.watch( './src/activities/*/js/**/*.js', ['activities'] )
        .on( 'change', browserSync.reload );
    gulp.watch( './src/cards/*/js/**/*.js', ['cards'] )
        .on( 'change', browserSync.reload );
    gulp.watch( './src/components/*/js/**/*.js', ['components'] )
        .on( 'change', browserSync.reload );

    gulp.watch( [
            './src/core/scss/base.scss',
            './src/core/scss/_variables.scss',
            './src/core/scss/modules/_mixins.scss',
            './src/core/scss/base/_reset.scss',
            './src/core/scss/base/_global.scss',
            './src/core/scss/base/_loader.scss'
        ], ['index'] )
        .on( 'change', browserSync.reload );
    gulp.watch( [
        './src/core/scss/morsels.scss',
        './src/core/scss/_variables.scss',
        './src/core/scss/components/**/*.scss',
        './src/core/scss/modules/**/*.scss',
        './src/activities/**/*.scss',
        './src/cards/**/*.scss',
        './src/components/**/*.scss'
    ], ['scss:framework'] );

    gulp.watch( './src/course/config.json', ['data', 'manifest', 'service-worker'] )
        .on( 'change', browserSync.reload );
    gulp.watch( './src/course/content/*.json', ['data'] )
        .on( 'change', browserSync.reload );

    gulp.watch( './src/course/resources/**/*', ['resources'] )
        .on( 'change', browserSync.reload );
} );

gulp.task( 'dev', ['default', 'serve'] );

gulp.task( 'default', [
    'index',
    'js',
    'activities',
    'cards',
    'components',
    'scss',
    'fonts',
    'data',
    'resources',
    'service-worker',
    'manifest'
] );