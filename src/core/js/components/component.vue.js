import Vue from '../resources/Vue';
import './card.vue';

Vue.component( 'component', {
	props: ['component'],
	template: '<div :class="classes">' +
					'<component :is="\'component-\' + component._component" ref="component" :component="component" v-on:complete="complete"></component>' +
				'</div>',
	data: function() {
		return {
			completed: false,
			isMounted: false
		};
	},
	computed: {
		classes: function() {
			let classes = {
				component: true,
				complete: this.completed
			};
			classes['component-' + this.component._component] = true;
			return classes;
		}
	},
	methods: {
		complete: function() {
			this.completed = true;
			this.$emit( 'complete' );
		}
	}
} );