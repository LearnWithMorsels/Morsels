import Vue from 'resources/Vue';
import 'card.vue';

Vue.component( 'stack', {
	props: ['stack', 'isCurrent'],
	template: '<div :class="classes">' +
					// '<h3>Stack {{ stack.title }}</h3>' +
					// '<p>Cards: {{ stack._cards.length }}, completed: {{ completedCards }}, dismissed: {{ dismissedCards }}</p>' +
					'<div class="cards">' +
						'<template v-for="(card, index) in stack._cards">' +
							'<card :card="card" :isCurrent="isCurrent && dismissedCards === index" :key="index" ref="cards" :zIndex="stack._cards.length - index" v-on:complete="cardCompleted" v-on:dismiss="cardDismissed"></card>' +
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
		completedCards: function() {
			let completedCount = 0;
			if( this.isMounted === true ) {
				for( let card of this.$refs.cards ) {
					if( card.isComplete ) {
						completedCount++;
					}
				}
			}
			return completedCount;
		},
		dismissedCards: function() {
			let dismissedCount = 0;
			if( this.isMounted === true ) {
				for( let card of this.$refs.cards ) {
					if( card.dismissed ) {
						dismissedCount++;
					}
				}
			}
			return dismissedCount;
		},
		currentCard: function() {
			return this.$refs.cards[this.dismissedCards];
		},
		completed: function() {
			return this.completedCards === this.stack._cards.length;
		},
		empty: function() {
			return this.dismissedCards === this.stack._cards.length;
		},
		classes: function() {
			let classes = {
				stack: true,
				empty: this.empty,
				complete: this.completed
			};
			classes[this.isCurrent ? 'current' : 'non-current'] = true;
			return classes;
		}
	},
	mounted: function() {
		this.isMounted = true;
	},
	methods: {
		cardCompleted: function() {
			if( this.completed ) {
				this.$emit( 'complete' );
			}
		},
		cardDismissed: function() {
			if( this.empty ) {
				this.$emit( 'empty' );
			}
		}
	}
} );