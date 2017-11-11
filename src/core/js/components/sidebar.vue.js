import Vue from 'resources/Vue';

Vue.component( 'sidebar', {
	props: ['course', 'language'],
	template: '<nav class="sidebar">' +
					'<header class="sidebar-header">' +
						'<button class="toggle-sidebar" v-on:click.prevent="close">' +
							'<i class="material-icons">close</i>' +
						'</button>' +
						'<h3>{{ content._content.title }}</h3>' +
						'<p>{{ content._content.description }}</p>' +
						'<div v-if="course.config.features && course.config.features.progress && course.config.features.progress.visible" class="course-progress">' +
							'<progress max="100" value="29"></progress>' +
							'<span v-if="course.config.features.progress.percentage" class="course-progress-percentage">29%</span>' +
						'</div>' +
					'</header>' +
					'<div class="sidebar-nav">' +
						'<button :class="{ current: selectedTab === 0 }" v-on:click.prevent="selectedTab = 0">' +
							'<i class="material-icons">explore</i>' +
						'</button>' +
						'<button v-if="course.config.features && course.config.features.favourites" :class="{ current: selectedTab === 1 }" v-on:click.prevent="selectedTab = 1">' +
							'<i class="material-icons">bookmark_border</i>' +
						'</button>' +
						'<button :class="{ current: selectedTab === 2 }" v-on:click.prevent="selectedTab = 2">' +
							'<i class="material-icons">info_outline</i>' +
						'</button>' +
						'<button v-if="languages.length > 1" :class="{ current: selectedTab === 3 }" v-on:click.prevent="selectedTab = 3">' +
							'<i class="material-icons">language</i>' +
						'</button>' +
						'<button v-if="course.config.features && course.config.features.search" :class="{ current: selectedTab === 4 }" v-on:click.prevent="selectedTab = 4">' +
							'<i class="material-icons">search</i>' +
						'</button>' +
						'<button v-on:click.prevent="toggleTheme">' +
							'<i class="material-icons">invert_colors</i>' +
						'</button>' +
					'</div>' +
					//'<transition-group name="fade" tag="div" mode="out-in">' +
						'<div v-show="selectedTab === 0" key="0" class="sidebar-content">' +
							'<ul>' +
								'<li v-for="chapter in content._chapters">{{ chapter.title }}' +
									'<ul>' +
										'<li v-for="stack in chapter._stacks">{{ stack.title }}' +
											//'<span> {{ stack.completed ? "completed" : "not completed" }}</span>' +
										'</li>' +
									'</ul>' +
								'</li>' +
							'</ul>' +
						'</div>' +
						'<div v-show="selectedTab === 1" key="1" class="sidebar-content">' +
							'<h3>Saved cards</h3>' +
							'<div class="saved-cards">' +
								'<div v-for="(savedCard, index) in globals.savedCards" :key="index">{{ savedCard }}</div>' +
							'</div>' +
						'</div>' +
						'<div v-show="selectedTab === 2" key="2" class="sidebar-content">' +
							'<p>INFO CARDS</p>' +
						'</div>' +
						'<div v-show="selectedTab === 3" key="3" class="sidebar-content">' +
							'<template v-for="language in languages">' +
								'<label>' +
									'<input type="radio" :value="language" v-model="selectedLanguage">' +
									'{{ course.config.languages.labels[language].name || language }}' +
								'</label>' +
								'<br>' +
							'</template>' +
						'</div>' +
						'<div v-show="selectedTab === 4" key="4" class="sidebar-content">' +
							'<p>SEARCH</p>' +
						'</div>' +
					//'</transition-group>' +
				'</nav>',
	data: function() {
		return {
			selectedLanguage: this.language,
			selectedTab: 0,
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
		toggleTheme: function() {
			document.documentElement.classList.toggle( 'dark-theme' );
		}
	}
} );