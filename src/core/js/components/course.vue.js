import Vue from '../resources/Vue';
import './chapter.vue';
 import './menubar.vue';
 import './sidebar.vue';

Vue.component( 'course', {
	props: ['course'],
	template: '<div :class="classes">' +
					'<menubar :content="content" v-on:toggleSidebar="toggleSidebar" v-on:undo="undo"></menubar>' +
					'<sidebar :course="course" :language="language" v-on:changeLanguage="changeLanguage" v-on:close="closeSidebar" v-on:overview="toggleOverview"></sidebar>' +
					'<div class="chapters" :style="style" v-on:mousedown.capture="closeSidebar" v-on:touchstart.capture="closeSidebar">' +
						'<chapter v-for="(chapter, index) in content._chapters" :chapter="chapter" :key="index" v-on:complete="goToNextchapter"></chapter>' +
					'</div>' +
				'</div>',
	data: function() {
		return {
			language: this.course.config.languages.default || this.course.config.languages.primary || this.course.content[Object.keys(this.course.content)[0]] || 'en',
			currentchapter: 0,
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
				transform: 'translateX(-' + ( this.currentchapter * 100 ) + '%)'
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
		goToNextchapter: function() {
			if( this.currentchapter + 1 < this.content._chapters.length - 1 ) {
				this.currentchapter++;
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
		toggleOverview: function() {
			this.viewAll = !this.viewAll;
			if( this.viewAll ) {
				this.closeSidebar();
			}
		},
		undo: function() {
			console.log( 'undo' );
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