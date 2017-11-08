import Vue from '../resources/Vue';
import './activity.vue';

Vue.component( 'activities', {
	props: ['activities'],
	template: '<div :class="classes">' +
					'<activity v-for="(activity, index) in activities._items" :key="index" ref="activities" :activity="activity" v-on:complete="completeActivity"></activity>' +
				'</div>',
	data: function() {
		return {
			isMounted: false,
			completed: false,
			correct: null
		};
	},
	computed: {
		classes: function() {
			return {
				activities: true,
				multiple: this.activities._items.length > 1
			};
		},
		isComplete: function() {
			let completed = false;
			if( this.isMounted === true ) {
				completed = this.activitiesComplete === this.activities._items.length;
			}
			return completed;
		},
		activitiesComplete: function() {
			let completeCount = 0;
			if( this.isMounted === true ) {
				for( let activity of this.$refs.activities ) {
					if( activity.isComplete ) {
						completeCount++;
					}
				}
			}
			return completeCount;
		}
	},
	mounted: function() {
		this.isMounted = true;
	},
	methods: {
		completeActivity: function() {
			if( this.isComplete &&
					!this.completed ) {
				this.completed = true;
				this.$emit( 'completed' );
			}
		}
	}
} );