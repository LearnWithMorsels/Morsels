import Vue from 'resources/Vue';

Vue.component( 'question-response', {
  props: ['correct', 'feedback', 'attemptsRemaining'],
  template: '<div class="response">' +
              '<template v-if="correct">' +
                '<template v-if="feedback._correct">' +
                  //TODO: FEEDBACK IMAGE
                  '<h4 v-if="feedback._correct.title">{{ feedback._correct.title }}</h4>' +
                  '<div v-if="feedback._correct.body" v-html="feedback._correct.body"></div>' +
                  '<div v-if="feedback._common && feedback._common.body" v-html="feedback._common.body"></div>' +
                '</template>' +
                '<div v-else>' +
                  '<h1>:D</h1>' +
                '</div>' +
                //TODO: Notes
              '</template>' +
              '<template v-else>' +
                '<template v-if="feedback._incorrect">' +
                  //TODO: FEEDBACK IMAGE
                  '<h4 v-if="feedback._incorrect.title">{{ feedback._incorrect.title }}</h4>' +
                  '<div v-if="feedback._incorrect.body" v-html="feedback._incorrect.body"></div>' +
                  '<div v-if="feedback._common && feedback._common.body" v-html="feedback._common.body"></div>' +
                '</template>' +
                '<div v-else>' +
                  '<h1>:\'(</h1>' +
                '</div>' +
                //TODO: Notes
              '</template>' +
              '<template v-if="canRetry">' +
                '<p>{{ attemptsRemaining }} attempts left</p>' +
                '<button v-on:click.prevent="retry">Retry</button>' +
              '</template>' +
            '</div>',
  data: function() {
    return {};
  },
  computed: {
    canRetry: function() {
      return (this.attemptsRemaining > 0 && !this.correct);
    }
  },
  methods: {
    retry: function() {
      this.$emit( 'retry' );
    }
  }
} );
