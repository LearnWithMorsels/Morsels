import Vue from '../resources/Vue';

Vue.component( 'menubar', {
	props: ['content'],
	template: '<nav class="menubar">' +
					'<button v-on:click.prevent="toggleSidebar">' +
						'<i class="material-icons">menu</i>' +
					'</button>' +
					//'<button v-on:click.prevent="undo">' +
					//	'<i class="material-icons">undo</i>' +
					//'</button>' +
				'</nav>',
	data: function() {
		return {
		};
	},
	methods: {
		toggleSidebar: function() {
			this.$emit( 'toggleSidebar' );
		},
		undo: function() {
			this.$emit( 'undo' );
		}
	}
} );