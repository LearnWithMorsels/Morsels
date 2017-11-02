Morsels.card( 'title', {
	props: ['card'],
	template: '<div class="card-contents">' +
					'<img v-if="card._content.image" :src="card._content.image.src" :alt="card._content.image.alt">' +
					'<h1 v-if="card._content.title" v-html="card._content.title"></h1>' +
					'<h2 v-if="card._content.subtitle" v-html="card._content.subtitle"></h2>' +
					'<p v-if="card._content.footer"><em v-html="card._content.footer"></em></p>' +
				'</div>',
	mounted: function() {
		this.$emit( 'complete' );
	}
} );