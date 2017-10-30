import Vue from '../resources/Vue';
import './stack.vue';

Vue.component( 'segment', {
	props: ['segment'],
	template: '<section class="segment" :style="style">' +
					//'<h2>segment {{ segment.title }}</h2>' +
					'<div class="stacks">' +
						'<stack v-for="(stack, index) in segment._stacks" :stack="stack" :key="index" v-on:empty="goToNextStack"></stack>' +
					'</div>' +
				'</section>',
	data: function() {
		return {
			currentStack: 0
		};
	},
	computed: {
		style: function() {
			return {
				transform: 'translateX(-' + ( this.currentStack * 100 ) + '%)'
			};
		}
	},
	methods: {
		goToNextStack: function() {
			if( this.currentStack + 1 < this.segment._stacks.length ) {
				this.currentStack++;
			} else {
				this.$emit( 'complete' );
			}
		}
	}
} );