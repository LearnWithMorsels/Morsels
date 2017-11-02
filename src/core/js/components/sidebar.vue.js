import Vue from '../resources/Vue';

Vue.component( 'sidebar', {
	props: ['course', 'language'],
	template: '<nav class="sidebar">' +
					'<header class="sidebar-header">' +
						'<button class="toggle-sidebar" v-on:click.prevent="close">' +
							'<i class="material-icons">close</i>' +
						'</button>' +
						'<h3>{{ content._content.title }}</h3>' +
						'<p>{{ content._content.description }}</p>' +
					'</header>' +
					'<div class="sidebar-nav">' +
						'<button>' +
							'<i class="material-icons" v-on:click.prevent="overview">dashboard</i>' +
						'</button>' +
						'<button>' +
							'<i class="material-icons">bookmark_border</i>' +
						'</button>' +
						'<button>' +
							'<i class="material-icons">info_outline</i>' +
						'</button>' +
						'<button>' +
							'<i class="material-icons">language</i>' +
						'</button>' +
						'<button>' +
							'<i class="material-icons">search</i>' +
						'</button>' +
					'</div>' +
					'<div class="structure">' +
						'<select v-if="languages.length > 1" v-model="selectedLanguage">' +
							'<option v-for="language in languages" :value="language">{{ course.config.languages.labels[language].name || language }}</option>' +
						'</select>' +
						'<ul>' +
							'<li v-for="chapter in content._chapters">{{ chapter.title }}' +
								'<ul>' +
									'<li v-for="stack in chapter._stacks">{{ stack.title }}' +
										//'<span> {{ stack.completed ? "completed" : "not completed" }}</span>' +
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
		},
		overview: function() {
			this.$emit( 'overview' );
		}
	}
} );