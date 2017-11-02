Morsels.activity( 'mcq', {
	props: ['activity'],
	template: '<div class="activity-contents">' +
	'<h3>{{ activity._content.title }}</h3>' +
	'<div v-html="activity._content.body"></div>' +
	'<p v-if="activity._content.instruction"><small><strong><em>{{ activity._content.instruction }}</em></strong></small></p>' +
	'<button v-on:click="completeMeCorrect">Yes, very much</button>' +
	'<button v-on:click="completeMeIncorrect">Not really</button>' +
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