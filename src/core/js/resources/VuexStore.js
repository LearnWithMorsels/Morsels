import Vuex from 'resources/Vuex';

export default class MorselsVuexStore {
	constructor( language ) {
		const store = new Vuex.Store( {
			state: {
				version: '',
				language: language,
				current: {
					chapter: 0,
					item: 0,
					index: 0
				},
				saved: []
			},
			mutations: {
				initialiseStore( state ) {
					if( localStorage.getItem( 'store' ) ) {
						this.replaceState(
							Object.assign( state, JSON.parse( localStorage.getItem( 'store' ) ) )
						);
					}
				},
				setLanguage( state, language ) {
					state.language = language;
					Morsels.offlineStore.update();
				},
				goTo( state, location ) {
					if( location.hasOwnProperty( 'index' ) ) {
						state.current.index = location.index;
					}
					if( location.hasOwnProperty( 'item' ) ) {
						state.current.item = location.item;
					}
					if( location.hasOwnProperty( 'chapter' ) ) {
						state.current.chapter = location.chapter;
					}
					Morsels.offlineStore.update();
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
					Morsels.offlineStore.update();
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
					Morsels.offlineStore.update();
				}
			},
			actions: {}
		} );

		store.subscribe( ( mutation, state ) => {
			//localStorage.setItem( 'store', JSON.stringify( state ) );
		} );

		return store;
	}
};