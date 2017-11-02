import Vue from '../resources/Vue';

Vue.component( 'activity', {
	props: ['activity'],
	template: '<div :class="classes" :data-activity="activity._type">' +
					'<component :is="\'activity-\' + activity._type" :activity="activity" v-on:complete="complete" v-on:isCorrect="isCorrect" v-on:isIncorrect="isIncorrect"></component>' +
				'</div>',
	data: function() {
		return {
			completed: false,
			correct: null
		};
	},
	computed: {
		classes: function() {
			let classes = {
				activity: true,
				complete: this.completed,
				correct: this.completed && this.correct
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
			console.log( 'ACT:Complete' );
			this.completed = true;
			this.$emit( 'complete' );
		},
		isCorrect: function() {
			this.correct = true;
			this.complete();
		},
		isIncorrect: function() {
			this.correct = false;
			this.complete();
		}
	}
} );