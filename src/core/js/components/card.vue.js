import Vue from 'resources/Vue';
import 'activities.vue';

Vue.component( 'card', {
	props: ['chapterIndex', 'stackIndex', 'cardIndex', 'card', 'dismissed', 'isCurrent', 'zIndex'],
	template: '<div :class="classes" :style="style" :data-card="card._card" :data-uid="_uid">' +
					'<component :is="cardName" ref="card" :card="card" v-on:completed="complete"></component>' +
					'<template v-if="card._activities">' +
						'<button class="show-activities" :class="{ prompt: promptActivites }" v-on:click.prevent.stop="openActivities">' +
							'<i v-if="activitiesCompleted" class="material-icons">check</i>' +
							'<i v-else class="material-icons">more_horiz</i>' +
						'</button>' +
						'<button class="hide-activities" v-on:click.prevent.stop="closeActivities">' +
							'<i class="material-icons">close</i>' +
						'</button>' +
						'<activities :activities="card._activities" ref="activities" v-on:completed="activitiesComplete"></activities>' +
						'<div v-if="card._activities._items.length > 1" class="card-activities-indicator">' +
							'<div v-for="(activity, index) in card._activities._items" :class="{ current: index === activitiesCompleted }"></div>' +
						'</div>' +
					'</template>' +
					//'<button class="save-card" v-on:click.prevent.stop="toggleSave">' +
					//	'<i v-if="saved" class="material-icons">bookmark</i>' +
					//	'<i v-else class="material-icons">bookmark_border</i>' +
					//'</button>' +
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
				pointerIsDown: false,
				touchIndex: 0,
				dragging: false
			},
			completed: this.card.completed || false,
			//dismissed: this.card.dismissed || false,
			showActivites: false,
			isMounted: false,
			baseFontSize: 16
		};
	},
	computed: {
		cardName: function() {
			return 'card-' + this.card._card;
		},
		classes: function() {
			let classes = {
				card: true,
				'show-activities': this.showActivites,
				complete: this.isComplete,
				//correct: this.isComplete && this.isCorrect,
				dismissed: this.dismissed,
				saved: this.saved,
				dragging: this.view.dragging,
				current: this.isCurrent
			};
			classes[this.cardName] = true;
			classes['card-' + this.card._card] = true;
			if( this.card._classes ) {
				for( let singleClass of this.card._classes.split( ' ' ) ) {
					classes[singleClass] = true;
				}
			}
			return classes;
		},
		style: function() {
			let style = {
				fontSize: this.baseFontSize + 'px',
				zIndex: this.zIndex
			};
			if( this.dismissed ) {
				style.transform = 'translate(' + ( this.view.offset.x * 3 ) + 'px, ' + ( this.view.offset.y * 3 ) + 'px)';
			} else if( this.view.dragging ) {
				style.transform = 'translate(' + this.view.offset.x + 'px, ' + this.view.offset.y + 'px)';
			}
			return style;
		},
		activitiesCompleted: function() {
			if( this.card._activities &&
					this.isMounted === true ) {
				return this.$refs.activities.isComplete;
			} else {
				return 0;
			}
		},
		activitiesOptional: function() {
			return ( !this.card._activities ||
					( !this.card._activities._options ||
						( this.card._activities._options &&
						this.card._activities._options._optional !== false ) ) );
		},
		isAllComplete: function() {
			let completed = false;
			if( this.isMounted === true ) {
				completed = this.completed && ( this.activitiesOptional || this.activitiesCompleted );
			}
			return completed;
		},
		saved: function() {
			for( let index in this.$store.state.saved ) {
				if( this.$store.state.saved[index].uid === this._uid ) {
					return true;
				}
			}
			return false;
		},
		promptActivites: function() {
			return !this.activitiesOptional && !this.activitiesCompleted && this.view.pointerIsDown;
		}
	},
	mounted: function() {
		this.$el.addEventListener( 'mousedown', this.pointerDown );
		this.$el.addEventListener( 'touchstart', this.pointerDown, {passive: true} );
		this.$el.addEventListener( 'mousemove', this.pointerMove );
		this.$el.addEventListener( 'touchmove', this.pointerMove );
		this.$el.addEventListener( 'mouseup', this.pointerUp );
		this.$el.addEventListener( 'touchend', this.pointerUp );
		this.$el.addEventListener( 'touchcancel', this.pointerUp );
		this.$el.addEventListener( 'mouseleave', this.pointerUp );
		this.isMounted = true;
		this.baseFontSize = parseInt( window.getComputedStyle( this.$el ).getPropertyValue( 'font-size' ) ) || 16;
	},
	methods: {
		complete: function() {
			//if( !this.completed ) {
				this.completed = true;
				//if( this.activitiesOptional ||
				//		this.activitiesCompleted ) {
				//	this.$emit( 'complete' );
				//}
			//}
		},
		activitiesComplete: function() {
			if( this.isMounted === true ) {
				this.closeActivities();
				//if( this.isAllComplete ) {
				//	this.$emit( 'completed' );
				//}
			}
		},
		save: function() {
			this.$store.commit( 'saveCard', {
				uid: this._uid,
				chapter: this.chapterIndex,
				chapteritem: this.stackIndex,
				chapteritemindex: this.cardIndex,
				//title: this.title || this.card._content.title || 'Untitled'
			} );
		},
		unsave: function() {
			this.$store.commit( 'unsaveCard', this._uid );
		},
		toggleSave: function() {
			this.saved ? this.unsave() : this.save();
		},
		dismiss: function() {
			//this.closeActivities();
			//this.dismissed = true;
			//if( typeof this.$refs.card.onDismiss === 'function' ) {
			//	this.$refs.card.onDismiss();
			//}

			this.$emit( 'dismiss' );
		},
		openActivities: function() {
			if( !this.activitiesCompleted ) {
				this.showActivites = true;
			}
		},
		closeActivities: function() {
			this.showActivites = false;
		},
		pointerDown: function( e ) {
			this.view.pointerIsDown = true;
			if( this.isCurrent &&
				this.isAllComplete &&
					!this.showActivites ) {
				if( e.touches ) {
					//this.view.touchIndex = e.touches.length - 1;
					this.view.pointerStart.x = e.touches[0].clientX || 0;
					this.view.pointerStart.y = e.touches[0].clientY || 0;
				} else {
					this.view.pointerStart.x = e.clientX || 0;
					this.view.pointerStart.y = e.clientY || 0;
				}
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
			this.view.pointerIsDown = false;
			if( !this.dismissed ) {
				this.view.dragging = false;

				if( Math.sqrt( Math.pow( this.view.offset.x, 2 ) + Math.pow( this.view.offset.y, 2 ) ) > ( ( this.$el.clientWidth / 2 ) || 200 ) ) {
					this.dismiss();
				} else {
					this.recenter();
				}
			}
		},
		recenter() {
			this.view.offset.x = 0;
			this.view.offset.y = 0;
		},
		setFontSize() {
			let hasScrollbars = this.$el.scrollHeight > this.$el.clientHeight;
			if( hasScrollbars &&
					this.baseFontSize > 10 ) {
				this.baseFontSize -= 0.5;
				//console.log( 'Still has scrollbars, setting to ' + this.baseFontSize );
			}
		}
	},
	updated: function() {
		//this.setFontSize();
	}
} );