import Vue from 'resources/Vue';
import 'card.vue';

Vue.component( 'stack', {
  props: ['chapterIndex', 'stackIndex', 'stack', 'isCurrent'],
  template: '<div :class="classes">' +
              '<div class="chapter-item-title">{{ stack.title }}</div>' +
              '<div class="cards">' +
                '<template v-for="(card, index) in stack._cards">' +
                  '<card :key="index"' +
                    ' ref="cards"' +
                    ' :card="card"' +
                    ' :isCurrent="isCurrent && currentCard === index"' +
                    //' :dismissed="index < currentCard"' +
                    ' :chapterIndex="chapterIndex"' +
                    ' :stackIndex="stackIndex"' +
                    ' :cardIndex="index"' +
                    ' :zIndex="stack._cards.length - index"' +
                    ' v-on:dismiss="goToNextCard"></card>' +
                '</template>' +
                '<i class="material-icons">check_circle</i>' +
              '</div>' +
            '</div>',
  data: function() {
    return {
      currentCard: 0,
      isMounted: false
    };
  },
  computed: {
    itemCount: function() {
      return this.stack._cards.length;
    },
    itemCompletedCount: function() {
      if( this.isMounted === true ) {
        let completed = 0;
        for( let card of this.$refs.cards ) {
          if( card.isAllComplete &&
              card.dismissed ) {
            completed++;
          }
        }
        return completed;
      } else {
        return 0;
      }
    },
    isComplete: function() {
      return this.itemCompletedCount === this.itemCount;
    },


    empty: function() {
      return this.currentCard === this.stack._cards.length;
    },
    classes: function() {
      let classes = {
        'chapter-item': true,
        stack: true,
        empty: this.empty,
        complete: this.isComplete
      };
      classes[this.isCurrent ? 'current' : 'non-current'] = true;
      return classes;
    }
  },
  mounted: function() {
    this.isMounted = true;
  },
  methods: {
    goToNextCard: function() {
      this.currentCard++;
      if( this.currentCard === this.stack._cards.length ) {
        this.$emit( 'completed' );
      }
    }
  }
} );
