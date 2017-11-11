import Vue from 'resources/Vue';

Vue.component( 'activity', {
	props: ['activity'],
	template: '<div :class="classes" :data-activity="activity._type">' +
					'<component :is="\'activity-\' + activity._type" :activity="activity" v-on:complete="complete"></component>' +
				'</div>',
	data: function() {
		return {
			completed: false
		};
	},
	computed: {
		classes: function() {
			let classes = {
				activity: true,
				complete: this.completed
			};
			classes['activity-' + this.activity._type] = true;
			return classes;
		},
		isComplete: function() {
			return this.completed;
		}
	},
	methods: {
		complete: function() {
			if( !this.completed ) {
				this.completed = true;
				this.$emit( 'completed' );
			}
		}
	}
} );