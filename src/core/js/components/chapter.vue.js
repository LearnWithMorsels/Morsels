import Vue from 'resources/Vue';
import 'stack.vue';
import 'component.vue';

Vue.component( 'chapter', {
	props: ['chapter', 'isCurrent'],
	template: '<section :class="classes" :style="style">' +
					'<div class="chapter-content">' +
						'<template v-for="(stack, index) in chapter._stacks">' +
							'<component v-if="stack._component" key="index" :isCurrent="isCurrent && currentStack === index" :component="stack" v-on:complete="goToNextStack"></component>' +
							'<stack v-else key="index" :isCurrent="isCurrent && currentStack === index" :stack="stack" v-on:empty="goToNextStack"></stack>' +
						'</template>' +
					'</div>' +
				'</section>',
	data: function() {
		return {
			currentStack: 0
		};
	},
	computed: {
		classes: function() {
			return {
				chapter: true,
				current: this.isCurrent
			};
		},
		style: function() {
			return {
				transform: 'translateX(-' + ( this.currentStack * 100 ) + '%)'
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