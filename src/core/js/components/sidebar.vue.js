import Vue from '../resources/Vue';

Vue.component( 'sidebar', {
	props: ['course', 'language'],
	template: '<nav class="sidebar">' +
					'<header class="sidebar-header">' +
						'<button class="toggle-sidebar" v-on:click.prevent="close">' +
							'<i class="material-icons">close</i>' +
						'</button>' +
						'<h1>{{ content._content.title }}</h1>' +
						'<p>{{ content._content.description }}</p>' +
					'</header>' +
					'<div class="structure">' +
						'<select v-if="languages.length > 1" v-model="selectedLanguage">' +
							'<option v-for="language in languages" :value="language">{{ course.config.languages.labels[language].name || language }}</option>' +
						'</select>' +
						'<h3>Structure</h3>' +
						'<ul>' +
							'<li v-for="segment in content._segments">' +
								'<p>{{ segment.title }}</p>' +
								'<ul>' +
									'<li v-for="stack in segment._stacks">' +
										'<p>{{ stack.title }} {{ stack.completed ? "completed" : "not completed" }}</p>' +
									'</li>' +
								'</ul>' +
							'</li>' +
						'</ul>' +
						//'<h3>Saved cards</h3>' +
						//'<div class="saved-cards">' +
						//	'<div v-for="(savedCard, index) in globals.savedCards" :key="index">{{ savedCard }}</div>' +
						//'</div>' +
					'</div>' +
				'</nav>',
	data: function() {
		return {
			selectedLanguage: this.language,
			globals: window.Morsels.globals.state
		};
	},
	computed: {
		content: function() {
			return this.course.content[this.language] || {}
		},
		languages: function() {
			return Object.keys( this.course.content );
		}
	},
	watch: {
		selectedLanguage: function( val, oldVal ) {
			this.$emit( 'changeLanguage', val );
		}
	},
	mounted: function() {
		//console.log( this.$root );
	},
	methods: {
		close: function() {
			this.$emit( 'close' );
		}
	}
} );