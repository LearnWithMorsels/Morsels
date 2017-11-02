Morsels.card( 'text', {
	props: ['card'],
	template: '<div class="card-contents">' +
					'<img v-if="card._content.image" class="card-image-header" :src="card._content.image.src" :alt="card._content.image.alt">' +
					'<h3 v-if="card._content.title" v-html="card._content.title"></h3>' +
					'<h4 v-if="card._content.subtitle" v-html="card._content.subtitle"></h4>' +
					'<div v-if="card._content.body" v-html="card._content.body"></div>' +
					'<p v-if="card._content.instruction"><small><strong><em>{{ card._content.instruction }}</em></strong></small></p>' +
				'</div>',
	mounted: function() {
		this.$emit( 'complete' );
	}
} );