const version = TIMESTAMP ? ( TIMESTAMP + '::' ) : '';

//SAVE THE THINGS
self.addEventListener( 'install', event => {
	event.waitUntil(
		caches
			.open( `${version}static` )
			.then( cache => {
				return cache
					.addAll( [
						'index.html',
						'course.json',
						'manifest.json',
						'css/base.css',
						'css/morsels.min.css',
						'css/fonts/MaterialIcons-Regular.eot',
						'css/fonts/MaterialIcons-Regular.ttf',
						'css/fonts/MaterialIcons-Regular.woff',
						'css/fonts/MaterialIcons-Regular.woff2',
						'js/activities.min.js',
						'js/cards.min.js',
						'js/components.min.js',
						'js/morsels.min.js'
					] );
			} )
			.then( () => {
				console.log( 'SERVICE WORKER::STATIC      Static cache complete' );
			} )
	);

	if( RESOURCES ) {
		event.waitUntil(
			caches
				.open( `${version}resources` )
				.then( cache => {
					return cache
						.addAll( RESOURCES );
				} )
				.then( () => {
					console.log( 'SERVICE WORKER::RESOURCES   Course resources cache complete' );
				} )
		);
	}
} );

//REFRESH THE THINGS (IF NEEDED)
self.addEventListener( 'activate', event => {
	event.waitUntil(
		caches
			.keys()
			.then( keys => {
				return Promise.all(
					keys
						.filter( key => {
							//If your cache name don't start with the current version...
							return !key.startsWith( version );
						} )
						.map( key => {
							console.log( 'SERVICE WORKER::DELETE      Cache item deleted: ' + key );
							//...YOU WILL BE DELETED
							return caches.delete( key );
						} )
				);
			} )
			.then( () => {
				console.log( 'SERVICE WORKER::DONE        Activation completed' );
			} )
	);

	//event.waitUntil( async function() {
	//	// Feature-detect
	//	if( self.registration.navigationPreload ) {
	//		// Enable navigation preloads!
	//		console.log( 'SERVICE WORKER::PRELOAD     Navigation preloads done' );
	//		await self.registration.navigationPreload.enable();
	//	}
	//}() );
} );

//SERVE THE THINGS
self.addEventListener( 'fetch', event => {
	if( event.request.method === 'GET' ) {
		event.respondWith(
			caches
				.match( event.request )
				.then( response => {
					if( response ) {
						console.log( 'SERVICE WORKER::CACHE       ' + response.url );
						return response;
					} else {
						console.log( 'SERVICE WORKER::LIVE        ' + event.request.url );
						return fetch( event.request )
							.then( response => {
								return caches
									.open( `${version}resources` )
									.then( cache => {
										cache.put( event.request, response.clone() );
										return response;
									} );
							} );
					}
				} )
				.catch( error => {
					console.warn( 'SERVICE WORKER::FAILED   fetch(' + event.request.url + ') failed', error );
					if( event.request.method === 'GET' &&
						event.request.url.indexOf( 'resources/' ) !== -1 ) {
						console.log( 'RETURN PLACEHOLDER IMAGE/VIDEO FOR ' + event.request.url );
						//return caches.match( './offline.html' );
					}
				} )
		);
	}
} );