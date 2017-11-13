import Vue from 'resources/Vue';
import 'card.vue';

Vue.component( 'component', {
	props: ['component', 'isCurrent'],
	template: '<div :class="classes">' +
					'<div class="component-title">{{ component.title }}</div>' +
					'<component :is="componentName" ref="component" :component="component" v-on:complete="complete"></component>' +
				'</div>',
	data: function() {
		return {
			completed: false,
			isMounted: false
		};
	},
	computed: {
		componentName: function() {
			return 'component-' + this.component._component;
		},
		classes: function() {
			let classes = {
				component: true,
				complete: this.completed,
				current: this.isCurrent
			};
			classes[this.componentName] = true;
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