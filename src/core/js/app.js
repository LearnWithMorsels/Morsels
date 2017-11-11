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
import 'components/course.vue';
import 'partials/question-response.vue';

const head = document.getElementsByTagName( 'body' )[0];

let Morsels = {
	appendJS: src => {
		let script = document.createElement( 'script' );
		script.textContent = src;
		head.append( script );
	},
	appendCSS: src => {
		let style = document.createElement( 'style' );
		style.type = 'text/css';
		style.textContent = src;
		head.append( style );
	},
	addCSS: href => {
		let link = document.createElement( 'link' );
		link.href = href;
		link.type = 'text/css';
		link.rel = 'stylesheet';
		head.append( link );
	},
	addMeta: ( name, content ) => {
		let meta = document.createElement( 'meta' );
		meta.name = name;
		meta.content = content;
		head.append( meta );
	},
	registerComponent: ( name, properties ) => {
		Vue.component( name, properties );
	},
	globals: {
		state: {
			savedCards: []
		},
		saveCard( cardUID ) {
			this.state.savedCards.push( cardUID )
		},
		unsaveCard( cardUID ) {
			let cardSavedIndex = this.state.savedCards.indexOf( cardUID );
			if( cardSavedIndex > -1 ) {
				this.state.savedCards.splice( cardSavedIndex, 1 );
			}
		}
	}
};

Morsels.activity = ( name, properties ) => {
	Morsels.registerComponent( 'activity-' + name, properties );
};

Morsels.card = ( name, properties ) => {
	Morsels.registerComponent( 'card-' + name, properties );
};

Morsels.component = ( name, properties ) => {
	Morsels.registerComponent( 'component-' + name, properties );
};

//Morsels.vuecomponent = Vue.component;

window.Morsels = Morsels;

Morsels.addCSS( './css/morsels.min.css' );

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

		Morsels.appendJS( returns[1] );
		Morsels.appendJS( returns[2] );
		Morsels.appendJS( returns[3] );
		//Morsels.appendCSS( returns[4] );

		Morsels.Vue = new Vue( {
			el: '#morsels-course',
			template: '<course :course="course"></course>',
			data: {
				course: course,
				globals: window.Morsels.globals.state
			}
		} );
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