Morsels.activity( 'mcq', {
	props: ['activity'],
	template: '<div class="activity-contents">' +
	'<h4>{{ activity._content.title }}</h4>' +
	'<h5>{{ activity._content.subtitle }}</h5>' +
	'<div v-html="activity._content.body"></div>' +
	'<button v-on:click="completeMeCorrect">Correct</button>' +
	'<button v-on:click="completeMeIncorrect">Incorrect</button>' +
	'</div>',
	data: function() {
		return {
			correct: false
		};
	},
	methods: {
		complete: function() {
			this.$emit( 'complete' );
		},
		completeMeCorrect: function() {
			this.correct = true;
			this.$emit( 'isCorrect' );
			this.complete();
		},
		completeMeIncorrect: function() {
			this.correct = false;
			this.$emit( 'isIncorrect' );
			this.complete();
		}
	}
} );