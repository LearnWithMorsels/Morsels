import Vue from 'resources/Vue';
import 'card.vue';

Vue.component( 'stack', {
	props: ['chapterIndex', 'stackIndex', 'stack', 'isCurrent'],
	template: '<div :class="classes">' +
					'<div class="chapter-item-title">{{ stack.title }}</div>' +
					'<div class="cards">' +
						'<template v-for="(card, index) in stack._cards">' +
							'<card key="index"' +
								' :card="card"' +
								' :isCurrent="isCurrent && currentCard === index"' +
								' ref="cards"' +
								' :dismissed="index < currentCard"' +
								' :chapterIndex="chapterIndex"' +
								' :stackIndex="stackIndex"' +
								' :cardIndex="index"' +
								' :zIndex="stack._cards.length - index"' +
								' v-on:dismiss="goToNextCard"></card>' +
						'</template>' +
						'<i class="material-icons">check_circle</i>' +
					'</div>' +
				'</div>',
	data: function() {
		return {
			isMounted: false
		};
	},
	computed: {
		currentCard: function() {
			return ( this.isCurrent ) ? this.$store.state.current.chapteritemindex : this.stack._cards.length;
		},
		empty: function() {
			return this.currentCard === this.stack._cards.length;
		},
		classes: function() {
			let classes = {
				'chapter-item': true,
				stack: true,
				empty: this.empty,
				//complete: this.completed
			};
			classes[this.isCurrent ? 'current' : 'non-current'] = true;
			return classes;
		}
	},
	mounted: function() {
		this.isMounted = true;
	},
	methods: {
		goToNextCard: function() {
			if( this.currentCard + 1 < this.stack._cards.length ) {
				this.$store.commit( 'goTo', { chapteritemindex: this.currentCard + 1 } ); // Creates a loop
			} else {
				this.$emit( 'completed' );
			}
		}
	}
} );