import Vue from '../resources/Vue';
import './segment.vue';
// import './sidebar.vue';

Vue.component( 'course', {
	props: ['course'],
	template: '<div class="course" :class="classes">' +
					//'<sidebar></sidebar>' +
					//'<h1>{{ content._content.title }}</h1>' +
					//'<div v-if="content._content.body" v-html="content._content.body"></div>' +
					//'<select v-if="languages.length > 1" v-model="language">' +
					//	'<option v-for="language in languages" :value="language">{{ course.config.languages.labels[language] || language }}</option>' +
					//'</select>' +
					'<div class="segments" :style="style">' +
						'<segment v-for="(segment, index) in content._segments" :segment="segment" :key="index" v-on:complete="goToNextSegment"></segment>' +
					'</div>' +
					//'<button class="toggle-overview" v-on:click.prevent="viewAll = !viewAll">See all</button>' +
				'</div>',
	data: function() {
		return {
			language: this.course.config.languages.default || this.course.config.languages.primary || this.course.content[Object.keys(this.course.content)[0]] || 'en',
			currentSegment: 0,
			viewAll: false
		};
	},
	computed: {
		content: function() {
			return this.course.content[this.language] || {}
		},
		languages: function() {
			return Object.keys( this.course.content );
		},
		courseTitle: function() {
			return this.course.content[this.language].title;
		},
		classes: function() {
			return {
				overview: this.viewAll
			};
		},
		style: function() {
			return {
				transform: 'translateY(-' + ( this.currentSegment * 100 ) + '%)'
			};
		}
	},
	mounted: function() {
		this.updateCourseTitle();
	},
	methods: {
		updateCourseTitle: function() {
			document.getElementsByTagName( 'title' )[0].textContent = this.courseTitle;
		},
		goToNextSegment: function() {
			if( this.currentSegment + 1 < this.content._segments.length - 1 ) {
				this.currentSegment++;
			} else {
				console.log( 'EVERYTHING DONE' );
			}
		}
	},
	watch: {
		language: function() {
			this.updateCourseTitle();
		}
	}
} );