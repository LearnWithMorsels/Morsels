import Vue from 'resources/Vue';
import 'flashcard.vue';

Vue.component( 'flashcards', {
  props: ['flashcards'],
  template: '<div class="flashcards" v-show="currentFlashcard">' +
              '<button class="close-flashcards" v-on:click.prevent="closeFlashcard">' +
                '<i class="material-icons">close</i>' +
              '</button>' +
              '<template v-for="(flashcard, id) in flashcards">' +
                '<flashcard v-show="id === currentFlashcard" :key="id" :content="flashcard"></flashcard>' +
              '</template>' +
            '</div>',
  data: function() {
    return {};
  },
  computed: {
    currentFlashcard: function() {
      return this.$store.state.flashcard;
    }
  },
  methods: {
    closeFlashcard: function() {
      return this.$store.commit( 'closeFlashcard' );
    }
  }
} );
