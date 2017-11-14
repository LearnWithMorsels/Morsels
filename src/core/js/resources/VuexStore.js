import Vuex from 'resources/Vuex';

export default class MorselsVuexStore {
	constructor( language ) {
		const store = new Vuex.Store( {
			state: {
				version: '',
				language: language,
				current: {
					chapter: 0,
					chapteritem: 3,
					chapteritemindex: 0
				},
				saved: []
			},
			mutations: {
				initialiseStore( state ) {
					if( localStorage.getItem( 'store' ) ) {
						this.replaceState(
							//Object.assign( state, JSON.parse( localStorage.getItem( 'store' ) ) );
						);
					}
				},
				setLanguage( state, language ) {
					state.language = language;
				},
				goTo( state, location ) {
					if( location.hasOwnProperty( 'chapteritemindex' ) ) {
						state.current.chapteritemindex = location.chapteritemindex;
					}
					if( location.hasOwnProperty( 'chapteritem' ) ) {
						state.current.chapteritem = location.chapteritem;
					}
					if( location.hasOwnProperty( 'chapter' ) ) {
						state.current.chapter = location.chapter;
					}

					//console.log( 'PUSH', JSON.stringify( state.current ) );
					//window.history.pushState( {
					//	chapter: state.current.chapter,
					//	chapteritem: state.current.chapteritem,
					//	chapteritemindex: state.current.chapteritemindex
					//}, 'test' );
				},
				goToPassive( state, location ) {
					if( location.hasOwnProperty( 'chapteritemindex' ) ) {
						state.current.chapteritemindex = location.chapteritemindex;
					}
					if( location.hasOwnProperty( 'chapteritem' ) ) {
						state.current.chapteritem = location.chapteritem;
					}
					if( location.hasOwnProperty( 'chapter' ) ) {
						state.current.chapter = location.chapter;
					}
				},
				saveCard( state, save ) {
					let cardIndex = -1;
					for( let index in state.saved ) {
						let saved = state.saved[index];
						if( saved.uid === save.uid ) {
							cardIndex = index;
							break;
						}
					}
					if( cardIndex === -1 ) {
						state.saved.push( save );
					}
				},
				unsaveCard( state, uid ) {
					let cardIndex = -1;
					for( let index in state.saved ) {
						let saved = state.saved[index];
						if( saved.uid === uid ) {
							cardIndex = index;
							break;
						}
					}
					if( cardIndex > -1 ) {
						state.saved.splice( cardIndex, 1 );
					}
				}
			},
			actions: {}
		} );

		store.subscribe( ( mutation, state ) => {
			//localStorage.setItem( 'store', JSON.stringify( state ) );
		} );

		window.onpopstate = ( e ) => {
			//console.log( 'POP', JSON.stringify( e.state ) );
			//store.commit( 'goToPassive', e.state );
		};

		//window.history.replaceState( {
		//	chapter: store.state.current.chapter,
		//	chapteritem: store.state.current.chapteritem,
		//	chapteritemindex: store.state.current.chapteritemindex
		//}, 'test' );

		return store;
	}
};