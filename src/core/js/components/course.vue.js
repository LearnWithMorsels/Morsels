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
						'<chapter v-for="(chapter, index) in content._chapters" key="index" :isCurrent="currentChapter === index" :chapter="chapter" v-on:complete="goToNextChapter"></chapter>' +
					'</div>' +
				'</div>',
	data: function() {
		return {
			view: {
				offset: {
					x: 0,
					y: 0
				},
				pointerStart: {
					x: 0,
					y: 0
				},
				touchIndex: 0,
				dragging: false
			},
			language: this.course.config.languages.default || this.course.config.languages.primary || this.course.content[Object.keys( this.course.content )[0]] || 'en',
			currentChapter: 0,
			showSidebar: false,
			viewAll: false,
			viewAllScale: 0.4
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
		style: function() {
			let style = {
				fontSize: this.baseFontSize + 'px',
				zIndex: this.zIndex
			};
			if( this.viewAll ) {
				style.transform = 'translate(' + this.view.offset.x + 'px, ' + this.view.offset.y + 'px) scale(' + this.viewAllScale + ')';
			} else {
				style.transform = 'translateY(-' + ( this.currentChapter * 100 ) + '%)';
			}
			return style;
		},
		rtl: function() {
			return this.course.config.languages.labels[this.language].rtl;
		}
	},
	mounted: function() {
		this.$el.addEventListener( 'mousedown', this.pointerDown );
		this.$el.addEventListener( 'touchstart', this.pointerDown, { passive: true } );
		this.$el.addEventListener( 'mousemove', this.pointerMove );
		this.$el.addEventListener( 'touchmove', this.pointerMove );
		this.$el.addEventListener( 'mouseup', this.pointerUp );
		this.$el.addEventListener( 'touchend', this.pointerUp );
		this.$el.addEventListener( 'touchcancel', this.pointerUp );
		this.$el.addEventListener( 'mouseleave', this.pointerUp );
		this.updateCourseTitle();
		this.updateLanguageAttr();
	},
	methods: {
		pointerDown: function( e ) {
			if( this.viewAll ) {
				let x, y;

				if( e.touches ) {
					//this.view.touchIndex = e.touches.length - 1;
					x = e.touches[0].clientX || 0;
					y = e.touches[0].clientY || 0;
				} else {
					x = e.clientX || 0;
					y = e.clientY || 0;
				}

				x -= this.view.offset.x;
				y -= this.view.offset.y;

				this.view.pointerStart.x = x;
				this.view.pointerStart.y = y;

				this.view.dragging = true;
			}
		},
		pointerMove: function( e ) {
			if( this.view.dragging ) {
				e.preventDefault();

				let x, y;

				if( e.touches ) {
					x = e.touches[0].clientX || 0;
					y = e.touches[0].clientY || 0;
				} else {
					x = e.clientX || 0;
					y = e.clientY || 0;
				}

				this.view.offset.x = ( x - this.view.pointerStart.x );
				this.view.offset.y = ( y - this.view.pointerStart.y );
			}
		},
		pointerUp: function() {
			//if( !this.dismissed ) {
				this.view.dragging = false;

			//	if( Math.sqrt( Math.pow( this.view.offset.x, 2 ) + Math.pow( this.view.offset.y, 2 ) ) > ( ( this.$el.clientWidth / 2 ) || 200 ) ) {
			//		this.dismiss();
			//	} else {
			//		this.recenter();
			//	}
			//}
		},
		updateCourseTitle: function() {
			document.getElementsByTagName( 'title' )[0].textContent = this.courseTitle;
		},
		updateLanguageAttr: function() {
			document.documentElement.lang = this.language;
		},
		goToNextChapter: function() {
			if( this.currentChapter + 1 < this.content._chapters.length ) {
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
				this.view.offset.x = 0;
				this.view.offset.y = 0;
				this.closeSidebar();
			}
		},
		undo: function() {
			console.log( 'undo' );
		},
		changeLanguage: function( language ) {
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