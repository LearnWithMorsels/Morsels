//import '../../../core/js/partials/question-response.vue';

Morsels.card( 'mcq', {
	props: ['card'],
	template: '<div class="card-contents">' +
					'<transition name="fade" mode="out-in">' +
						'<div v-if="!submitted" key="question">' +
							'<template v-if="card._content">' +
								'<h4>{{ card._content.title }}</h4>' +
								'<h5>{{ card._content.subtitle }}</h5>' +
								'<div v-html="card._content.body"></div>' +
								'<div class="mcq-options">' +
									'<label v-for="(item, index) in card._items">' +
										'<input :type="inputType" :value="index" v-model="selectedItems">' +
										'<span class="mcq-option-title">{{ item.title }}</span>' +
									'</label>' +
								'</div>' +
								'<button v-on:click="submitAnswer" :disabled="canSubmit === false">Submit</button>' +
							'</template>' +
						'</div>' +
						'<question-response v-else key="response" :correct="correct" :feedback="card._feedback" :attemptsRemaining="attemptsRemaining" v-on:retry="retry"></question-response>' +
					'</transition>' +
				'</div>',
	data: function() {
		return {
			attempts: 0,
			submitted: false,
			selectedItems: [],
			correct: false
		};
	},
	computed: {
		multipleSelect: function() {
			return ( this.card._options &&
					this.card._options._selectable &&
					this.card._options._selectable > 1 );
		},
		canSubmit: function() {
			if( this.multipleSelect &&
					this.card._options &&
					this.card._options._selectable ) {
				return ( this.selectedItems.length <= parseInt( this.card._options._selectable ) );
			} else {
				return true;
			}
		},
		attemptsRemaining: function() {
			if( this.card._options &&
					this.card._options._attempts ) {
				return this.card._options._attempts - this.attempts;
			} else {
				return 1 - this.attempts;
			}
		},
		inputType: function() {
			return this.multipleSelect ? 'checkbox' : 'radio';
		}
	},
	methods: {
		complete: function() {
			this.$emit( 'complete' );
		},
		submitAnswer: function() {
			let correct = true;
			if( Array.isArray( this.selectedItems ) ) {
				for( let optionIndex in this.card._items ) {
					if( this.card._items.hasOwnProperty( optionIndex ) ) {
						let option = this.card._items[optionIndex],
								isSelected = ( this.selectedItems.indexOf( parseInt( optionIndex ) ) !== -1 );
						if( ( option._shouldBeSelected && !isSelected )
								|| ( !option._shouldBeSelected && isSelected ) ) {
							correct = false;
							break;
						}
					}
				}
			} else if( typeof this.selectedItems === 'number' ) {
				let selectedOption = this.card._items[this.selectedItems];
				if( selectedOption._shouldBeSelected === false ) {
					correct = false;
				}
			}
			this.submitted = true;
			this.correct = correct;
			this.attempts++;
			if( this.correct ) {
				this.complete();
			} else if( this.attemptsRemaining === 0 ) {
				this.complete();
			}
		},
		retry: function() {
			this.selectedItems = [];
			this.submitted = false;
		}
	}
} );