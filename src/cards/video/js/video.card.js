Morsels.card( 'video', {
	props: ['card'],
	template: '<div class="card-contents">' +
					'<h4>{{ card._content.title }}</h4>' +
					'<h5>{{ card._content.subtitle }}</h5>' +
					'<template v-if="card._content._video._local">' +
						'<video width="400" height="225" preload="metadata" :poster="resourceURI(card._content._video._local.poster)">' +
							'<source v-if="card._content._video._local._src.webm" :src="resourceURI(card._content._video._local._src.webm)" type="video/webm">' +
							'<source v-if="card._content._video._local._src.ogv" :src="resourceURI(card._content._video._local._src.ogv)" type="video/ogg">' +
							'<source v-if="card._content._video._local._src.mp4" :src="resourceURI(card._content._video._local._src.mp4)" type="video/mp4">' +
						'</video>' +
						'<button v-on:click.prevent="toggle">' +
							'<i v-if="playing" class="material-icons">pause</i>' +
							'<i v-else class="material-icons">play_arrow</i>' +
						'</button>' +
						'<button v-on:click.prevent="fullscreen">' +
							'<i class="material-icons">fullscreen</i>' +
						'</button>' +
					'</template>' +
					'<iframe v-else-if="card._content._video._youtube" :src="\'https://www.youtube.com/embed/\' + card._content._video._youtube.id + \'?rel=0\'" width="640" height="360" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>' +
					//'<iframe v-else-if="card._content._video._youtube" :src="\'https://www.youtube.com/embed/\' + card._content._video._youtube.id + \'?rel=0{{#unless properties._content._video._youtube._showControlsControls}}&amp;controls=0{{/unless}}{{#unless properties._content._video._youtube._showControlsTitle}}&amp;showinfo=0{{/unless}}" width="400" height="225" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>' +
					'<iframe v-else-if="card._content._video._vimeo" :src="\'https://player.vimeo.com/video/\' + card._content._video._vimeo.id" width="640" height="360" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>' +
					//'<iframe v-else-if="card._content._video._vimeo" src="https://player.vimeo.com/video/{{properties._content._video._vimeo.id}}?color={{global.config.appColour}}{{#unless properties._content._video._vimeo._showControlsTitle}}&amp;title=0{{/unless}}{{#unless properties._content._video._vimeo._showControlsByline}}&amp;byline=0{{/unless}}{{#unless properties._content._video._vimeo._showControlsPortrait}}&amp;portrait=0{{/unless}}" width="400" height="225" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>' +
				'</div>',
	data: function() {
		return {
			$video: null,
			playing: false
		};
	},
	mounted: function() {
		this.$video = this.$el.getElementsByTagName( 'video' )[0];

		if( this.$video ) {
			this.$video.addEventListener( 'ended', () => {
				this.playing = false;
				this.$video.currentTime = 0;
				this.$video.load();
			} );
			this.$video.addEventListener( 'play', () => {
				this.playing = true;
			} );
			this.$video.addEventListener( 'pause', () => {
				this.playing = false;
			} );
		} else {
			this.$emit( 'complete' );
		}
	},
	methods: {
		play: function() {
			let videos = document.getElementsByTagName( 'video' );

			for( let i = 0; i < videos.length; i++ ) {
				let video = videos[i];
				video.pause();
			}

			if( this.$video ) {
				this.playing = true;
				this.$video.play();
				this.$emit( 'complete' );
				// this.$emit( 'isCorrect' );
			}
		},
		pause: function() {
			if( this.$video ) {
				this.playing = false;
				this.$video.pause();
			}
		},
		toggle: function() {
			if( this.$video ) {
				this.playing ? this.pause() : this.play();
			}
		},
		restart: function() {
			if( this.$video ) {
				this.$video.currentTime = 0;
				this.play();
			}
		},
		fullscreen: function() {
			if( this.$video.requestFullscreen ) {
				this.$video.requestFullscreen();
			} else if( this.$video.mozRequestFullScreen ) {
				this.$video.mozRequestFullScreen();
			} else if( this.$video.webkitRequestFullscreen ) {
				this.$video.webkitRequestFullscreen();
			} else if( this.$video.msRequestFullscreen ) {
				this.$video.msRequestFullscreen();
			}
		},
		resourceURI: function( videoFile ) {
			return './resources/' + videoFile;
		},
		onDismiss: function() {
			this.pause();
		}
	},
	beforeDestroy: function() {
		this.$video.pause();
	}
} );