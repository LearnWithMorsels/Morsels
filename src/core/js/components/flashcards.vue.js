import Vue from 'resources/Vue';
import 'flashcard.vue';

Vue.component( 'flashcards', {
	props: ['flashcards'],
	template: '<div class="flashcards">' +
					'<button class="close-flashcards">' +
						'<i class="material-icons">close</i>' +
					'</button>' +
					'<template v-for="(flashcard, id) in flashcards">' +
						'<flashcard :key="id" :content="flashcard"></flashcard>' +
					'</template>' +
				'</div>',
	data: function() {
		return {
		};
	}
} );