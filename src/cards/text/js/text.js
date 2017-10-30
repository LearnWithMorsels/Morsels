Morsels.card( 'text', {
	props: ['card'],
	template: '<div class="card-contents">' +
					'<h4 v-if="card._content.title" v-html="card._content.title"></h4>' +
					'<h5 v-if="card._content.subtitle" v-html="card._content.subtitle"></h5>' +
					'<div v-if="card._content.body" v-html="card._content.body"></div>' +
				'</div>',
	mounted: function() {
		this.$emit( 'complete' );
	}
} );