import Vue from 'resources/Vue';
import 'chapter.vue';
import 'menubar.vue';
import 'sidebar.vue';
import 'flashcards.vue';

Vue.component( 'course', {
	props: ['course'],
	template: '<div :class="classes">' +
					'<menubar :content="content"' +
						' v-on:toggleSidebar="toggleSidebar"' +
						' v-on:navigateBack="navigateBack"' +
						' v-on:overview="toggleOverview"></menubar>' +
					'<sidebar ref="sidebar"' +
						' :course="course"' +
						' :content="content"' +
						' :language="language"' +
						' :flashcards="flashcards"' +
						' :percentageComplete="percentageComplete"' +
						' v-on:close="closeSidebar"></sidebar>' +
					'<div class="chapters" :style="chaptersStyle" v-on:mousedown.capture="bodyClick" v-on:touchstart.capture="bodyClick">' +
						'<div class="chapters-inner" :style="chaptersInnerStyle">' +
							'<chapter v-for="(chapter, index) in content._chapters"' +
								' :key="index"' +
								' ref="chapters"' +
								' :chapterIndex="index"' +
								' :chapter="chapter"' +
								' :isCurrent="currentChapter === index"' +
								' v-on:completed="goToNextChapter"></chapter>' +
						'</div>' +
					'</div>' +
					//'<flashcards :flashcards="flashcards"></flashcards>' +
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
			showSidebar: false,
			viewAll: false,
			viewAllScale: 0.4,
			isMounted: false
		};
	},
	computed: {
		language: function() {
			return this.$store.state.language;
		},
		currentChapter: function(  ) {
			return this.$store.state.current.chapter;
		},
		currentChapterItem: function(  ) {
			return this.$store.state.current.item;
		},
		percentageComplete: function() {
			if( this.isMounted === true ) {
				let items = 0,
						completed = 0;
				for( let chapter of this.$refs.chapters ) {
					items += chapter.itemCount;
					completed += chapter.itemCompletedCount;
				}
				return ( completed / items ) * 100;
			}
		},
		content: function() {
			return this.course.content[this.language];
		},
		flashcards: function() {
			return this.content._flashcards || {};
		},
		courseTitle: function() {
			return this.content.title || 'Untitled';
		},
		classes: function() {
			return {
				course: true,
				rtl: this.rtl,
				overview: this.viewAll,
				'show-sidebar': this.showSidebar
			};
		},
		chaptersStyle: function() {
			let style = {};
			if( this.viewAll ) {
				style.transform = 'translate(' + this.view.offset.x + 'px, ' + this.view.offset.y + 'px) scale(' + this.viewAllScale + ')';
				if( this.view.dragging ) {
					style.transition = 'none';
				}
			} else {
				style.transform = 'translate(0, 0) scale(1)';
			}
			return style;
		},
		chaptersInnerStyle: function() {
			let style = {};
			if( this.viewAll ) {
				style.transform = 'translate(0, 0)';
			} else {
				style.transform = 'translate(-' + ( this.currentChapterItem * 100 ) + '%, -' + ( this.currentChapter * 100 ) + '%)';
			}
			return style;
		},
		rtl: function() {
			return this.course.languages[this.language].rtl;
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
		this.isMounted = true;
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
				//this.currentChapter++;
				this.$store.commit( 'goTo', { chapter: this.currentChapter + 1, item: 0 } );
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
		bodyClick: function() {
			this.closeSidebar();
		},
		toggleOverview: function() {
			this.viewAll = !this.viewAll;
			if( this.viewAll ) {
				this.view.offset.x = 0;
				this.view.offset.y = 0;
				this.closeSidebar();
			}
		},
		navigateBack: function() {
			if( this.$store.state.current.item > 0 ) {
				this.$store.commit( 'goTo', { item: this.$store.state.current.item - 1 } );
			} else if( this.$store.state.current.chapter > 0 ) {
				this.$store.commit( 'goTo', { chapter: this.$store.state.current.chapter - 1 } );
			}
		}
	},
	watch: {
		language: function() {
			this.updateCourseTitle();
			this.updateLanguageAttr();
		}
	}
} );