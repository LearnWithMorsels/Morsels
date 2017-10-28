import Vue from '../resources/Vue';

Vue.component( 'sidebar', {
	template: '<div class="sidebar">' +
					'<div class="saved-cards">' +
						'<div v-for="(savedCard, index) in globals.savedCards" :key="index">{{ savedCard }}</div>' +
					'</div>' +
				'</div>',
	data: function() {
		return {
			globals: window.Morsels.globals.state
		};
	}
} );