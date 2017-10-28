// const version = '2017-10-10::';
//
// //SAVE THE THINGS
// self.addEventListener( 'install', event => {
// 	event.waitUntil(
// 			caches
// 					.open( `${version}static` )
// 					.then( cache => {
// 						return cache
// 								.addAll( [
// 									'/app/Resources/css/smileonthetiles.com.min.css',
// 									'/app/Resources/fonts/FontAwesome.otf',
// 									'/app/Resources/fonts/fontawesome-webfont.svg',
// 									'/app/Resources/fonts/fontawesome-webfont.woff2',
// 									'/app/Resources/fonts/fontawesome-webfont.eot',
// 									'/app/Resources/fonts/fontawesome-webfont.ttf',
// 									'/app/Resources/fonts/fontawesome-webfont.woff',
// 									'/app/Resources/images/photoswipe/default-skin.png',
// 									'/app/Resources/images/photoswipe/default-skin.svg',
// 									'/app/Resources/images/photoswipe/custom.png',
// 									'/app/Resources/images/photoswipe/custom.svg',
// 									'/app/Resources/images/photoswipe/preloader.gif',
// 									'/app/Resources/images/banner-background.jpg',
// 									'/app/Resources/js/smileonthetiles.com.min.js',
// 									'https://fonts.googleapis.com/css?family=Roboto+Condensed|Roboto:400,300,500,700',
// 									'https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css',
// 									'https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/fonts/fontawesome-webfont.woff2?v=4.7.0',
// 									'https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/fonts/fontawesome-webfont.woff?v=4.7.0',
// 									'https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/fonts/fontawesome-webfont.ttf?v=4.7.0',
// 									'https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/fonts/fontawesome-webfont.svg?v=4.7.0',
// 									'https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js',
// 									'https://cdnjs.cloudflare.com/ajax/libs/handlebars.js/4.0.6/handlebars.min.js',
// 									'https://cdn.polyfill.io/v2/polyfill.min.js?features=es6,fetch'
// 								] );
// 					} )
// 					.then( () => {
// 						console.log( 'SERVICE WORKER::STATIC   Static cache complete' );
// 					} )
// 	);
//
// 	event.waitUntil(
// 			caches
// 					.open( `${version}offline` )
// 					.then( cache => {
// 						return cache
// 								.addAll( [
// 									'/favicon.ico',
// 									'/offline.html',
// 									'/app/Resources/images/logos/smileonthetiles-logo.svg',
// 									'/app/Resources/images/logos/smileonthetiles-logo-white.svg',
// 									'https://cdnjs.cloudflare.com/ajax/libs/phaser/2.6.2/phaser.min.js',
// 									'/app/Resources/offline/offline.min.js'
// 								] );
// 					} )
// 					.then( () => {
// 						console.log( 'SERVICE WORKER::OFFLINE  Offline cache complete' );
// 					} )
// 	);
//
// 	event.waitUntil(
// 			caches
// 					.open( `${version}icons` )
// 					.then( cache => {
// 						return cache
// 								.addAll( [
// 									'/app/Resources/images/icons/icon-48.png',
// 									'/app/Resources/images/icons/icon-57.png',
// 									'/app/Resources/images/icons/icon-72.png',
// 									'/app/Resources/images/icons/icon-96.png',
// 									'/app/Resources/images/icons/icon-114.png',
// 									'/app/Resources/images/icons/icon-128.png',
// 									'/app/Resources/images/icons/icon-144.png',
// 									'/app/Resources/images/icons/icon-152.png',
// 									'/app/Resources/images/icons/icon-167.png',
// 									'/app/Resources/images/icons/icon-180.png',
// 									'/app/Resources/images/icons/icon-192.png',
// 									'/app/Resources/images/icons/icon-256.png',
// 									'/app/Resources/images/icons/icon-512.png',
// 									'/app/Resources/images/icons/icon-1024.png',
// 									'/app/Resources/images/icons/icon-plain-48.png',
// 									'/app/Resources/images/icons/icon-plain-57.png',
// 									'/app/Resources/images/icons/icon-plain-72.png',
// 									'/app/Resources/images/icons/icon-plain-96.png',
// 									'/app/Resources/images/icons/icon-plain-114.png',
// 									'/app/Resources/images/icons/icon-plain-128.png',
// 									'/app/Resources/images/icons/icon-plain-144.png',
// 									'/app/Resources/images/icons/icon-plain-152.png',
// 									'/app/Resources/images/icons/icon-plain-167.png',
// 									'/app/Resources/images/icons/icon-plain-180.png',
// 									'/app/Resources/images/icons/icon-plain-192.png',
// 									'/app/Resources/images/icons/icon-plain-256.png',
// 									'/app/Resources/images/icons/icon-plain-512.png',
// 									'/app/Resources/images/icons/icon-plain-1024.png',
// 									'/app/Resources/images/icons/icon-square-48.png',
// 									'/app/Resources/images/icons/icon-square-57.png',
// 									'/app/Resources/images/icons/icon-square-72.png',
// 									'/app/Resources/images/icons/icon-square-96.png',
// 									'/app/Resources/images/icons/icon-square-114.png',
// 									'/app/Resources/images/icons/icon-square-128.png',
// 									'/app/Resources/images/icons/icon-square-144.png',
// 									'/app/Resources/images/icons/icon-square-152.png',
// 									'/app/Resources/images/icons/icon-square-167.png',
// 									'/app/Resources/images/icons/icon-square-180.png',
// 									'/app/Resources/images/icons/icon-square-192.png',
// 									'/app/Resources/images/icons/icon-square-256.png',
// 									'/app/Resources/images/icons/icon-square-512.png',
// 									'/app/Resources/images/icons/icon-square-1024.png'
// 								] );
// 					} )
// 					.then( () => {
// 						console.log( 'SERVICE WORKER::ICONS    Icons cache complete' );
// 					} )
// 	);
//
// 	let offlineRequest = new Request( 'offline.html' );
//
// 	event.waitUntil(
// 			fetch( offlineRequest )
// 					.then( ( response ) => {
// 						return caches
// 								.open( `${version}offline` )
// 								.then( cache => {
// 									console.log( 'SERVICE WORKER::OFFLINE  Cached offline response' );
// 									return cache.put( offlineRequest, response );
// 								} );
// 					} )
// 	);
// } );
//
// //REFRESH THE THINGS (IF NEEDED)
// self.addEventListener( 'activate', event => {
// 	event.waitUntil(
// 			caches
// 					.keys()
// 					.then( keys => {
// 						return Promise.all(
// 								keys
// 										.filter( key => {
// 											//If your cache name don't start with the current version...
// 											return !key.startsWith( version );
// 										} )
// 										.map( key => {
// 											console.log( 'SERVICE WORKER::DELETE   Cache item deleted: ' + key );
// 											//...YOU WILL BE DELETED
// 											return caches.delete( key );
// 										} )
// 						);
// 					} )
// 					.then( () => {
// 						console.log( 'SERVICE WORKER::DONE     Activation completed' );
// 					} )
// 	);
//
// 	event.waitUntil( async function() {
// 		// Feature-detect
// 		if( self.registration.navigationPreload ) {
// 			// Enable navigation preloads!
// 			console.log( 'SERVICE WORKER::PRELOAD  Navigation preloads done' );
// 			await self.registration.navigationPreload.enable();
// 		}
// 	}() );
// } );
//
// //SERVE THE THINGS
// self.addEventListener( 'fetch', event => {
// 	if( event.request.method === 'GET' &&
// 			event.request.url.indexOf( 'smileonthetiles2.co.uk' ) === -1 ) {
// 		caches
// 				.match( event.request )
// 				.then( () => {
// 					event.respondWith(
// 							caches
// 									.match( event.request )
// 									.then( response => {
// 										if( response ) {
// 											console.log( 'SERVICE WORKER::CACHE    ' + response.url );
// 											return response;
// 										} else {
// 											console.log( 'SERVICE WORKER::LIVE     ' + event.request.url );
// 											return fetch( event.request, {
// 												method: event.request.method,
// 												//mode: 'same-origin',
// 												credentials: event.request.credentials,
// 												redirect: 'manual'
// 											} );
// 										}
// 									} )
// 									.catch( error => {
// 										if( event.request.method === 'GET' ) {
// 											console.warn( 'SERVICE WORKER::FAILED   fetch(' + event.request.url + ') failed', error );
// 											return caches.match( './offline.html' );
// 										}
// 									} )
// 					);
// 				} )
// 				.catch( error => {} );
// 	}
// } );