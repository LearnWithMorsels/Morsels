import Vue from '../resources/Vue';
import './activity.vue';

Vue.component( 'activities', {
	props: ['activities'],
	template: '<div class="activities">' +
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
			console.log( 'ACTS:Complete' );
			if( this.isComplete ) {
				this.completed = true;
				this.$emit( 'complete' );
			}
		}
	}
} );