import Vue from 'resources/Vue';
import 'stack.vue';
import 'component.vue';

Vue.component( 'chapter', {
	props: ['chapterIndex', 'chapter', 'isCurrent'],
	template: '<section :class="classes" :style="style">' +
					'<div class="chapter-content">' +
						'<template v-for="(stack, index) in chapter._stacks">' +
							'<component v-if="stack._component" key="index" :isCurrent="isCurrent && currentItem === index" :component="stack" v-on:complete="goToNextItem"></component>' +
							'<stack v-else key="index" :isCurrent="isCurrent && currentItem === index" :stack="stack" :chapterIndex="chapterIndex" v-on:empty="goToNextItem"></stack>' +
						'</template>' +
					'</div>' +
				'</section>',
	data: function() {
		return {
			//currentItem: 0
		};
	},
	computed: {
		currentItem: function() {
			return this.$store.state.current.item;
		},
		classes: function() {
			return {
				chapter: true,
				current: this.isCurrent
			};
		},
		style: function() {
			return {
				transform: this.isCurrent ? 'translateX(-' + ( this.currentItem * 100 ) + '%)' : 'none'
			};
		}
	},
	methods: {
		goToNextItem: function() {
			if( this.currentItem + 1 < this.chapter._stacks.length ) {
				//this.currentItem++;
				this.$store.commit( 'goTo', { item: this.currentItem + 1 } );
			} else {
				this.$emit( 'complete' );
			}
		}
	}
} );