Morsels.card( 'text', {
	props: ['card'],
	template: '<div class="card-contents">' +
					'<h4>{{ card._content.title }}</h4>' +
					'<h5>{{ card._content.subtitle }}</h5>' +
					'<div v-html="card._content.body"></div>' +
				'</div>',
	mounted: function() {
		this.$emit( 'complete' );
	}
} );