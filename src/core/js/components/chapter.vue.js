import Vue from 'resources/Vue';
import 'stack.vue';
import 'component.vue';

Vue.component( 'chapter', {
  props: ['chapterIndex', 'chapter', 'isCurrent'],
  template: '<section :class="classes" :style="style">' +
              '<div class="chapter-title">{{ chapter.title }}</div>' +
              '<div class="chapter-content">' +
                '<template v-for="(item, index) in chapter._items">' +
                  '<component v-if="item._component"' +
                    ' :key="index"' +
                    ' ref="items"' +
                    ' :isCurrent="isCurrent && currentChapterItem === index"' +
                    ' :chapterIndex="chapterIndex"' +
                    ' :component="item"' +
                    ' :componentIndex="index"' +
                    ' v-on:completed="goToNextItem"></component>' +
                  '<stack v-else' +
                    ' :key="index"' +
                    ' ref="items"' +
                    ' :isCurrent="isCurrent && currentChapterItem === index"' +
                    ' :chapterIndex="chapterIndex"' +
                    ' :stack="item"' +
                    ' :stackIndex="index"' +
                    ' v-on:completed="goToNextItem"></stack>' +
                '</template>' +
              '</div>' +
            '</section>',
  data: function() {
    return {
      isMounted: false
    };
  },
  computed: {
    itemCount: function() {
      if( this.isMounted === true ) {
        let items = 0;
        for( let item of this.$refs.items ) {
          items += item.itemCount;
        }
        return items;
      } else {
        return 0;
      }
    },
    itemCompletedCount: function() {

      //TODO: Count VUEX

      //let completed = 0;
      //console.log( 'A', this.chapterIndex, this.$store.state.completion );
      //if( this.$store.state.completion[this.chapterIndex] ) {
      //  console.log( 'B' );
      //  for( let item of this.$store.state.completion[this.chapterIndex] ) {
      //    console.log( 'C', item );
      //    if( item === true ) {
      //      console.log( 'D' );
      //      completed++;
      //    }
      //  }
      //}
      //return completed;


      if( this.isMounted === true ) {
        let completed = 0;
        for( let item of this.$refs.items ) {
          completed += item.itemCompletedCount;
        }
        return completed;
      } else {
        return 0;
      }
    },
    isComplete: function() {
      return this.itemCompletedCount === this.itemCount;
    },
    currentChapterItem: function() {
      return this.$store.state.current.item;
    },
    classes: function() {
      return {
        chapter: true,
        current: this.isCurrent
      };
    },
    style: function() {
      return {
        //transform: this.isCurrent ? 'translateX(-' + ( this.currentChapterItem * 100 ) + '%)' : 'none'
      };
    }
  },
  mounted: function() {
    this.isMounted = true;
  },
  methods: {
    markCurrentItemComplete() {
      //this.$store.dispatch( 'setComplete', {
      //  chapter: this.chapterIndex,
      //  item: this.currentChapterItem
      //} );
    },
    goToNextItem: function() {
      //this.markCurrentItemComplete();
      if( this.currentChapterItem + 1 < this.chapter._items.length ) {
        this.$store.commit( 'goTo', { item: this.currentChapterItem + 1 } );
      } else {
        this.$emit( 'completed' );
      }
    }
  }
} );
