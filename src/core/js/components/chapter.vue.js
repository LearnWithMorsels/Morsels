import Vue from '../resources/Vue';
import './stack.vue';
import './component.vue';

Vue.component( 'chapter', {
	props: ['chapter'],
	template: '<section class="chapter" :style="style">' +
					'<div class="chapter-content">' +
						'<template v-for="(stack, index) in chapter._stacks">' +
							'<component v-if="stack._component" :component="stack" :key="index" v-on:complete="goToNextStack"></component>' +
							'<stack v-else :stack="stack" :key="index" v-on:empty="goToNextStack"></stack>' +
						'</template>' +
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
				transform: 'translateY(-' + ( this.currentStack * 100 ) + '%)'
			};
		}
	},
	methods: {
		goToNextStack: function() {
			if( this.currentStack + 1 < this.chapter._stacks.length ) {
				this.currentStack++;
			} else {
				this.$emit( 'complete' );
			}
		}
	}
} );