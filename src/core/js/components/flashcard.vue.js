import Vue from 'resources/Vue';

Vue.component( 'flashcard', {
  props: ['content'],
  template: '<div class="flashcard">' +
              '<div class="flashcard-title">{{ content.title }}</div>' +
              '<div class="flashcard-body" v-html="content.body"></div>' +
            '</div>',
  data: function() {
    return {};
  }
} );
