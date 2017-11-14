Morsels.component( 'conversation', {
	props: ['chapterIndex', 'componentIndex', 'component', 'isCurrent'],
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
		return {};
	},
	computed: {
		conversationIndex: function(  ) {
			return ( this.isCurrent ) ? this.$store.state.current.chapteritemindex : this.component._items.length;
		},
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
			if( this.conversationIndex < this.component._items.length ) {
				this.$store.commit( 'goTo', { chapteritemindex: this.conversationIndex + 1 } );
			} else {
				this.$emit( 'completed' );
			}
		}
	}
} );