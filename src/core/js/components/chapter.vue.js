import Vue from 'resources/Vue';
import 'stack.vue';
import 'component.vue';

Vue.component( 'chapter', {
	props: ['chapterIndex', 'chapter', 'isCurrent'],
	template: '<section :class="classes" :style="style">' +
					'<div class="chapter-title">{{ chapter.title }}</div>' +
					'<div class="chapter-content">' +
						'<template v-for="(chapterItem, index) in chapter._items">' +
							'<component v-if="chapterItem._component"' +
								' key="index"' +
								' :isCurrent="isCurrent && currentChapterItem === index"' +
								' :chapterIndex="chapterIndex"' +
								' :component="chapterItem"' +
								' :componentIndex="chapterIndex"' +
								' :chapterItemIndex="index"' +
								' v-on:completed="goToNextItem"></component>' +
							'<stack v-else' +
								' key="index"' +
								' :isCurrent="isCurrent && currentChapterItem === index"' +
								' :chapterIndex="chapterIndex"' +
								' :stack="chapterItem"' +
								' :stackIndex="chapterIndex"' +
								' :chapterItemIndex="index"' +
								' v-on:completed="goToNextItem"></stack>' +
						'</template>' +
					'</div>' +
				'</section>',
	data: function() {
		return {
			//currentChapterItem: 0
		};
	},
	computed: {
		currentChapterItem: function() {
			return this.$store.state.current.chapteritem;
		},
		classes: function() {
			return {
				chapter: true,
				current: this.isCurrent
			};
		},
		style: function() {
			return {
				//transform: this.isCurrent ? 'translateX(-' + ( this.currentChapterItem * 100 ) + '%)' : 'none'
			};
		}
	},
	methods: {
		goToNextItem: function() {
			if( this.currentChapterItem + 1 < this.chapter._items.length ) {
				//this.currentChapterItem++;
				this.$store.commit( 'goTo', { chapteritem: this.currentChapterItem + 1, chapteritemindex: 0 } );
			} else {
				this.$emit( 'completed' );
			}
		}
	}
} );