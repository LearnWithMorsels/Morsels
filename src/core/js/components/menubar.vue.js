import Vue from 'resources/Vue';

/**
 * ==========================================
 * core -> components -> menubar
 * ==========================================
 * @constructor menubar
 * @summary Displays icons for navigation
 * @description
 * Menu bar at the top of the screen
 * @param {object} content Course content
 */
Vue.component( 'menubar', {
	props: ['content'],
	template: '<nav class="menubar">' +
					'<button v-on:click.prevent="toggleSidebar">' +
						'<i class="material-icons">menu</i>' +
					'</button>' +
					//'<button v-on:click.prevent="overview">' +
					//	'<i class="material-icons">dashboard</i>' +
					//'</button>' +
					'<div class="spacer"></div>' +
					'<button v-show="canUndo" v-on:click.prevent="undo">' +
						'<i class="material-icons">undo</i>' +
					'</button>' +
					//'<div class="menubar-submenu-wrapper">' +
					//	'<button v-on:click.prevent="toggleSubmenu">' +
					//		'<i class="material-icons">more_vert</i>' +
					//	'</button>' +
					//	'<transition name="fade">' +
					//		'<div v-show="submenuVisible" class="menubar-submenu">' +
					//			'<button>' +
					//				'Theme <i class="material-icons">invert_colors</i>' +
					//			'</button>' +
					//		'</div>' +
					//	'</transition>' +
					//'</div>' +
				'</nav>',
	data: function() {
		return {
			submenuVisible: false
		};
	},
	computed: {
		canUndo: function() {
			return ( this.$store.state.current.index > 0 || this.$store.state.current.item > 0 || this.$store.state.current.chapter > 0 );
		}
	},
	methods: {
		toggleSidebar: function() {
			this.$emit( 'toggleSidebar' );
		},
		undo: function() {
			this.$emit( 'navigateBack' );
		},
		overview: function() {
			this.$emit( 'overview' );
		},
		hideSubmenu: function() {
			this.submenuVisible = false;
		},
		toggleSubmenu: function() {
			this.submenuVisible = !this.submenuVisible;
		}
	}
} );
