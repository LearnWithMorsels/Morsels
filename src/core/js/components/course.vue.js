import Vue from '../resources/Vue';
import './chapter.vue';
 import './menubar.vue';
 import './sidebar.vue';

Vue.component( 'course', {
	props: ['course'],
	template: '<div :class="classes">' +
					'<menubar :content="content" v-on:toggleSidebar="toggleSidebar" v-on:undo="undo" v-on:overview="toggleOverview"></menubar>' +
					'<sidebar ref="sidebar" :course="course" :language="language" v-on:changeLanguage="changeLanguage" v-on:close="closeSidebar"></sidebar>' +
					'<div class="chapters" :style="style" v-on:mousedown.capture="bodyClick" v-on:touchstart.capture="bodyClick">' +
						'<chapter v-for="(chapter, index) in content._chapters" :chapter="chapter" :key="index" v-on:complete="goToNextchapter"></chapter>' +
					'</div>' +
				'</div>',
	data: function() {
		return {
			language: this.course.config.languages.default || this.course.config.languages.primary || this.course.content[Object.keys(this.course.content)[0]] || 'en',
			currentChapter: 0,
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
				transform: 'translateX(-' + ( this.currentChapter * 100 ) + '%)'
			};
		}
	},
	mounted: function() {
		this.updateCourseTitle();
		this.updateLanguageAttr();
	},
	methods: {
		updateCourseTitle: function() {
			document.getElementsByTagName( 'title' )[0].textContent = this.courseTitle;
		},
		updateLanguageAttr: function() {
			document.documentElement.lang = this.language;
		},
		goToNextchapter: function() {
			if( this.currentChapter + 1 < this.content._chapters.length - 1 ) {
				this.currentChapter++;
			} else {
				//alert( 'EVERYTHING DONE' );
			}
		},
		toggleSidebar: function() {
			this.showSidebar = !this.showSidebar;
		},
		closeSidebar: function() {
			this.showSidebar = false;
		},
		closeMenubarSubmenu: function() {
			//this.$refs.sidebar.hideSubmenu();
		},
		bodyClick: function() {
			this.closeSidebar();
			this.closeMenubarSubmenu();
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
			this.updateLanguageAttr();
		}
	}
} );