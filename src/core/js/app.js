/**!
 * --------------------------------------------
 *  __  __  ___  ____  ____  _____ _     ____
 * |  \/  |/ _ \|  _ \/ ___|| ____| |   / ___|
 * | |\/| | | | | |_) \___ \|  _| | |   \___ \
 * | |  | | |_| |  _ < ___) | |___| |___ ___) |
 * |_|  |_|\___/|_| \_|____/|_____|_____|____/
 *
 * ----------[ BITE-SIZED ELEARNING ]----------
 */

import Vue from 'resources/Vue';
import Vuex from 'resources/Vuex';
import 'components/course.vue';
import 'partials/question-response.vue';

const head = document.getElementsByTagName( 'body' )[0],
	appendJS = src => {
		let script = document.createElement( 'script' );
		script.textContent = src;
		head.append( script );
	},
	appendCSS = src => {
		let style = document.createElement( 'style' );
		style.type = 'text/css';
		style.textContent = src;
		head.append( style );
	},
	addCSS = href => {
		let link = document.createElement( 'link' );
		link.href = href;
		link.type = 'text/css';
		link.rel = 'stylesheet';
		head.append( link );
	},
	addMeta = ( name, content ) => {
		let meta = document.createElement( 'meta' );
		meta.name = name;
		meta.content = content;
		head.append( meta );
	};

let Morsels = {
	registerComponent: ( name, properties ) => {
		Vue.component( name, properties );
	},


	activity: ( name, properties ) => {
	Morsels.registerComponent( 'activity-' + name, properties );
},

card: ( name, properties ) => {
	Morsels.registerComponent( 'card-' + name, properties );
},

component: ( name, properties ) => {
	Morsels.registerComponent( 'component-' + name, properties );
}
};

//Morsels.vuecomponent = Vue.component;

window.Morsels = Morsels;

addCSS( './css/morsels.min.css' );

let fetchFile = file => {
		return fetch( file )
			.then( response => response.text() )
			.catch( e => {
				console.error( e );
			} );
	},
	fetchJSONFile = file => {
		return fetch( file )
			.then( response => response.json() )
			.catch( e => {
				console.error( e );
			} );
	};

Promise.all( [
	fetchJSONFile( './course.json' ),
	fetchFile( './js/activities.min.js' ),
	fetchFile( './js/cards.min.js' ),
	fetchFile( './js/components.min.js' ),
	//fetchFile( './css/morsels.min.css' )
] )
	.then( returns => {
		let course = returns[0];

		appendJS( returns[1] );
		appendJS( returns[2] );
		appendJS( returns[3] );
		//appendCSS( returns[4] );

		const store = new Vuex.Store( {
			state: {
				course: course,
				current: {
					chapter: 0,
					item: 0
				},
				saved: []
			},
			mutations: {
				goTo( state, location ) {
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

		const app = new Vue( {
			el: '#morsels-course',
			template: '<course :course="course"></course>',
			store,
			data: {
				course: course
			}
		} );

		//Morsels.Vue = app;
		//Morsels.store = store;
	} );

if( 'serviceWorker' in navigator &&
	window.location.hostname !== 'localhost' ) {
	navigator
		.serviceWorker
		.register( './sw.js' )
		.then( swReg => {
			console.log( 'Service worker registered', swReg );
		} )
		.catch( e => {
			console.error( 'Service worker registration error', e );
		} );
}