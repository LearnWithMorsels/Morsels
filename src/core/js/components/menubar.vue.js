import Vue from '../resources/Vue';

Vue.component( 'menubar', {
	props: ['content'],
	template: '<nav class="menubar">' +
					'<button v-on:click.prevent="toggleSidebar">' +
						'<i class="material-icons">menu</i>' +
					'</button>' +
				'</nav>',
	data: function() {
		return {
		};
	},
	methods: {
		toggleSidebar: function() {
			this.$emit( 'toggleSidebar' );
		}
	}
} );