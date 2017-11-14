import Vue from 'resources/Vue';
import 'card.vue';

Vue.component( 'component', {
	props: ['chapterIndex', 'componentIndex', 'component', 'isCurrent'],
	template: '<div :class="classes">' +
					'<div class="chapter-item-title">{{ component.title }}</div>' +
					'<component ref="component"' +
						' :is="componentName"' +
						' :chapterIndex="chapterIndex"' +
						' :componentIndex="componentIndex"' +
						' :component="component"' +
						' :isCurrent="isCurrent"' +
						' v-on:completed="complete"></component>' +
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
				'chapter-item': true,
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
			if( !this.completed ) {
				this.completed = true;
				this.$emit( 'completed' );
			}
		}
	}
} );