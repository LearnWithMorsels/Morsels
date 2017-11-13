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
import MorselsVuexStore from 'resources/VuexStore';
import 'resources/RegisterServiceWorker';
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

		const store = new MorselsVuexStore( course.config.languages.default || course.config.languages.primary || course.content[Object.keys( course.content )[0]] || 'en' ),
			app = new Vue( {
				el: '#morsels-course',
				template: '<course :course="course"></course>',
				store,
				data: {
					course: course
				},
				beforeCreate() {
					this.$store.commit( 'initialiseStore' );
				}
			} );

		Morsels.COURSE = course;
		//Morsels.VUE = app;
		//Morsels.STORE = store;
	} );

window.Morsels = Morsels;