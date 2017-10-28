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
						'<div v-else key="response">' +
							'<template v-if="card._feedback">' +
			//TODO: FEEDBACK IMAGES
								'<template v-if="correct">' +
									'<template v-if="card._feedback._correct">' +
										'<h4 v-if="card._feedback._correct.title">{{ card._feedback._correct.title }}</h4>' +
										'<div v-if="card._feedback._correct.body" v-html="card._feedback._correct.body"></div>' +
										'<div v-if="card._feedback._common && card._feedback._common.body" v-html="card._feedback._common.body"></div>' + //TODO: Notes
									'</template>' +
									'<div v-else>' +
										':D' +
									'</div>' +
								'</template>' +
								'<template v-else>' +
									'<template v-if="card._feedback._incorrect">' +
										'<h4 v-if="card._feedback._incorrect.title">{{ card._feedback._incorrect.title }}</h4>' +
										'<div v-if="card._feedback._incorrect.body" v-html="card._feedback._incorrect.body"></div>' +
										'<div v-if="card._feedback._common && card._feedback._common.body" v-html="card._feedback._common.body"></div>' + //TODO: Notes
									'</template>' +
									'<div v-else>' +
										':\'(' +
									'</div>' +
								'</template>' +
							'</template>' +
							'<template v-if="canRetry">' +
								'<p>{{ attemptsRemaining }} attempts left</p>' +
								'<button v-on:click.prevent="retry">Retry</button>' +
							'</template>' +
						'</div>' +
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
		canRetry: function() {
			return ( this.attemptsRemaining > 0 && !this.correct );
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