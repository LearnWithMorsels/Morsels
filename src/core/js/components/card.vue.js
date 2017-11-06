import Vue from '../resources/Vue';
import './activities.vue';

Vue.component( 'card', {
	props: ['card', 'current', 'zIndex'],
	template: '<div :class="classes" :data-card="card._card" :style="style" :data-uid="_uid">' +
					'<component :is="\'card-\' + card._card" ref="card" :card="card" v-on:complete="complete"></component>' +
					'<template v-if="card._activities">' +
						'<button class="show-activities" v-on:click.prevent.stop="openActivities">' +
							'<i v-if="activitiesComplete" class="material-icons">check</i>' +
							'<i v-else class="material-icons">more_horiz</i>' +
						'</button>' +
						'<button class="hide-activities" v-on:click.prevent.stop="closeActivities">' +
							'<i class="material-icons">close</i>' +
						'</button>' +
					'</template>' +
					//'<button class="save-card" v-on:click.prevent.stop="toggleSave">' +
					//	'<i v-if="saved" class="material-icons">bookmark</i>' +
					//	'<i v-else class="material-icons">bookmark_border</i>' +
					//'</button>' +
					'<activities v-if="card._activities" :activities="card._activities" ref="activities" v-on:complete="completeActivities"></activities>' +
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
				pointerdown: false,
				touchIndex: 0,
				dragging: false
			},
			completed: this.card.completed || false,
			dismissed: this.card.dismissed || false,
			showActivites: false,
			isMounted: false,
			baseFontSize: 16,
			globals: window.Morsels.globals.state
		};
	},
	computed: {
		classes: function() {
			let classes = {
				card: true,
				'show-activities': this.showActivites,
				complete: this.isComplete,
				correct: this.isComplete && this.isCorrect,
				dismissed: this.dismissed,
				saved: this.saved,
				dragging: this.view.dragging,
				current: this.current
			};
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
		activitiesComplete: function() {
			if( this.isMounted === true ) {
				let activitiesComplete = this.$refs.activities.isComplete;
				if( activitiesComplete ) {
					this.closeActivities();
				}
				return activitiesComplete;
			} else {
				return false;
			}
		},
		isComplete: function() {
			let completed = false;
			if( this.isMounted === true ) {
				if( this.card._activities &&
						( !this.card._activities._options ||
								( this.card._activities._options &&
										this.card._activities._options._optional !== true ) ) ) {
					completed = this.completed && this.activitiesComplete;
				} else {
					completed = this.completed;
				}
			}
			return completed;
		},
		saved: function() {
			return this.globals.savedCards.indexOf( this._uid ) !== -1;
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
			this.completed = true;

			if( this.isComplete ) {
				this.$emit( 'completed' );
			}

			if( this.isCorrect ) {
				this.$emit( 'correct' );
			}
		},
		completeActivities: function() {
			if( this.isMounted === true ) {
				console.log( 'CARD:ACT:Complete' );

				if( this.isComplete ) {
					this.closeActivities();
					this.$emit( 'completed' );//TODO: HIDE "SHOW ACTIVITY" BUTTON
				}
			}
		},
		save: function() {
			window.Morsels.globals.saveCard( this._uid );
		},
		unsave: function() {
			window.Morsels.globals.unsaveCard( this._uid );
		},
		toggleSave: function() {
			this.saved ? this.unsave() : this.save();
		},
		dismiss: function() {
			this.closeActivities();
			this.dismissed = true;
			if( typeof this.$refs.card.onDismiss === 'function' ) {
				this.$refs.card.onDismiss();
			}

			this.$emit( 'dismiss' );

			if( this.isComplete ) {
				this.$emit( 'complete' );
			}
		},
		openActivities: function() {
			if( !this.activitiesComplete ) {
				this.showActivites = true;
			}
		},
		closeActivities: function() {
			this.showActivites = false;
		},
		pointerDown: function( e ) {
			if( this.current &&
				this.isComplete &&
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
				this.view.pointerdown = true;
			}
		},
		pointerMove: function( e ) {
			if( this.view.pointerdown ) {
				e.preventDefault();

				let x, y;

				if( e.touches ) {
					x = e.touches[0].clientX || 0;
					y = e.touches[0].clientY || 0;
				} else {
					x = e.clientX || 0;
					y = e.clientY || 0;
				}

				this.view.dragging = true;
				this.view.offset.x = ( x - this.view.pointerStart.x );
				this.view.offset.y = ( y - this.view.pointerStart.y );
			}
		},
		pointerUp: function() {
			if( !this.dismissed ) {
				this.view.pointerdown = false;
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
		this.setFontSize();
	}
} );