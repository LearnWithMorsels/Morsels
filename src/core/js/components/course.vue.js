import Vue from '../resources/Vue';
import './segment.vue';
 import './menubar.vue';
 import './sidebar.vue';

Vue.component( 'course', {
	props: ['course'],
	template: '<div :class="classes">' +
					'<menubar :content="content" v-on:toggleSidebar="toggleSidebar"></menubar>' +
					'<sidebar :course="course" :language="language" v-on:changeLanguage="changeLanguage" v-on:close="closeSidebar"></sidebar>' +
					'<div class="segments" :style="style" v-on:mousedown.capture="closeSidebar" v-on:touchstart.capture="closeSidebar">' +
						'<segment v-for="(segment, index) in content._segments" :segment="segment" :key="index" v-on:complete="goToNextSegment"></segment>' +
					'</div>' +
					//'<button class="toggle-overview" v-on:click.prevent="viewAll = !viewAll">See all</button>' +
				'</div>',
	data: function() {
		return {
			language: this.course.config.languages.default || this.course.config.languages.primary || this.course.content[Object.keys(this.course.content)[0]] || 'en',
			currentSegment: 0,
			showSidebar: false,
			viewAll: false
		};
	},
	computed: {
		content: function() {
			return this.course.content[this.language] || {}
		},
		courseTitle: function() {
			return this.course.content[this.language].title;
		},
		classes: function() {
			return {
				course: true,
				rtl: this.rtl,
				overview: this.viewAll,
				'show-sidebar': this.showSidebar
			};
		},
		rtl: function() {
			return this.course.config.languages.labels[this.language].rtl;
		},
		style: function() {
			return {
				transform: 'translateX(-' + ( this.currentSegment * 100 ) + '%)'
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
				alert( 'EVERYTHING DONE' );
			}
		},
		toggleSidebar: function() {
			this.showSidebar = !this.showSidebar;
		},
		closeSidebar: function() {
			this.showSidebar = false;
		},
		changeLanguage: function( language) {
			this.language = language;
		}
	},
	watch: {
		language: function() {
			this.updateCourseTitle();
		}
	}
} );