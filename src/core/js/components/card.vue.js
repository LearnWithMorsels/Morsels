import Vue from '../resources/Vue';
import './activities.vue';

Vue.component( 'card', {
	props: ['card', 'zIndex'],
	template: '<div :class="classes" :data-card="card._card" :style="{ zIndex: zIndex, left: view.offset.x + \'px\', top: view.offset.y + \'px\' }" :data-uid="_uid">' +
					'<component :is="\'card-\' + card._card" ref="card" :card="card" v-on:complete="complete"></component>' +
					'<template v-if="card._activities">' +
						'<button class="show-activities" v-on:click.prevent.stop="openActivities">' +
							'<i class="material-icons">more_horiz</i>' +
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
				dragging: this.view.dragging
			};
			classes['card-' + this.card._card] = true;
			return classes;
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
			this.showActivites = true;
		},
		closeActivities: function() {
			this.showActivites = false;
		},
		pointerDown: function( e ) {
			if( this.isComplete &&
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
					this.view.offset.x *= 3;
					this.view.offset.y *= 3;
					this.dismiss();
				} else {
					this.recenter();
				}
			}
		},
		recenter() {
			this.view.offset.x = 0;
			this.view.offset.y = 0;
		}
	}
} );