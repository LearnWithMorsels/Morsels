Morsels.component( 'conversation', {
	props: ['component'],
	template: '<div class="component-contents">' +
					'<template v-for="item in conversationSoFar">' +
						'<div class="conversation-item" :class="{ me: item.me }" v-html="item.body"></div>' +
					'</template>' +
					'<button v-on:click.prevent="nextItem">{{ conversationIndex >= component._items.length ? "Done" : "Next" }}</button>' +
				'</div>',
	data: function() {
		return {
			conversationIndex: 0
		};
	},
	computed: {
		conversationSoFar: function() {
			return this.component._items.slice( 0, this.conversationIndex );
		}
	},
	mounted: function() {
		//console.log( this.component );
		//console.log( this.component._items );
	},
	methods: {
		nextItem: function() {
			this.conversationIndex++;
			console.log( this.conversationIndex, this.component._items.length );
			if( this.conversationIndex > this.component._items.length ) {
				console.log( 'DONE' );
				this.$emit( 'complete' );
			} else {
				console.log( 'Next' );
			}
		}
	}
} );