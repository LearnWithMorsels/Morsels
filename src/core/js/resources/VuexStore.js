import Vuex from 'resources/Vuex';

export default class MorselsVuexStore {
	constructor( language ) {
		const store = new Vuex.Store( {
			state: {
				version: '',
				language: language,
				current: {
					chapter: 1,
					item: 0
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
					if( location.hasOwnProperty( 'item' ) ) {
						state.current.item = location.item;
					}
					if( location.hasOwnProperty( 'chapter' ) ) {
						state.current.chapter = location.chapter;
					}

					//console.log( 'PUSH', JSON.stringify( state.current ) );
					//window.history.pushState( {
					//	chapter: state.current.chapter,
					//	item: state.current.item
					//}, 'test' );
				},
				goToPassive( state, location ) {
					if( location.hasOwnProperty( 'item' ) ) {
						state.current.item = location.item;
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
		//	item: store.state.current.item
		//}, 'test' );

		return store;
	}
};