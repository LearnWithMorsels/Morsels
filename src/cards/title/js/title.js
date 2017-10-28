Morsels.card( 'title', {
	props: ['card'],
	template: '<div class="card-contents">' +
					'<h1>{{ card._content.title }}</h1>' +
					'<h2>{{ card._content.subtitle }}</h2>' +
				'</div>',
	mounted: function() {
		this.$emit( 'complete' );
	}
} );