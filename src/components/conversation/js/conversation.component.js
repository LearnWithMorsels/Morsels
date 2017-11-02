Morsels.component( 'conversation', {
	props: ['component'],
	template: '<div class="component-contents">' +
					'<div class="conversation-contents">' +
						'<transition-group name="conversation-item-add" tag="div">' +
							'<div v-for="(item, index) in this.component._items" v-show="index < conversationIndex" class="conversation-item" key="index" :class="{ me: !item.name }">' +
								'<h5 v-if="item.name">{{ item.name }}</h5>' +
								//'<h5 v-else><em>Me</em></h6>' +
								'<div v-html="item.body"></div>' +
							'</div>' +
						'</transition-group>' +
					'</div>' +
					'<div class="conversation-options">' +
						'<button v-on:click.prevent="nextItem">{{ conversationIndex >= component._items.length ? "Done" : "Next" }}</button>' +
					'</div>' +
				'</div>',
	data: function() {
		return {
			conversationIndex: 1
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
			//console.log( this.conversationIndex, this.component._items.length );
			if( this.conversationIndex > this.component._items.length ) {
				//console.log( 'DONE' );
				this.$emit( 'complete' );
			} else {
				//console.log( 'Next' );
			}
		}
	}
} );