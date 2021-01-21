import Vue from 'resources/Vue';

Vue.component( 'sidebar-navigation-item', {
  props: ['config', 'chapters', 'chapterIndex', 'chapterItemIndex', 'item'],
  template: '<div class="sidebar-list-item">' +
                '<button class="sidebar-list-item-button"' +
                    ' :disabled="locked"' +
                    ' v-on:click="goToItem">' +
                  '<i class="material-icons sidebar-list-item-icon">{{ icon }}</i>' +
                  '<div class="sidebar-list-item-title">{{ item.title }}</div>' +
                  '<i v-if="complete" class="material-icons sidebar-list-item-status">check</i>' +
                '</button>' +
              '</div>',
  data: function() {
    return {
    };
  },
  computed: {
    complete: function() {
      return ( this.$store.state.completion[this.chapterIndex] &&
          this.$store.state.completion[this.chapterIndex][this.chapterItemIndex] === true );
    },
    isChapterComplete: function() {
      if( this.$store.state.completion[this.chapterIndex] ) {
        let complete = true;
        for( let itemIndex in this.chapters[this.chapterIndex]._items ) {
          if( !this.$store.state.completion[this.chapterIndex][this.chapterItemIndex] ||
              this.$store.state.completion[this.chapterIndex][this.chapterItemIndex] !== true ) {
            complete = false;
            break;
          }
        }
        return complete;
      } else {
        return false;
      }
    },
    locked: function() {
      if( this.config.features &&
          this.config.features.locked ) {
        if( this.chapterItemIndex === 0 ) {
          if( this.chapterIndex === 0 ) {
            return false;
          } else {
            return !this.isChapterComplete;
          }
        } else {
          return !this.complete;
        }
      } else {
        return false;
      }
    },
    icon: function() {
      if( this.locked ) {
        return 'lock';
      } else {
        return this.chapters[this.chapterIndex]._items[this.chapterItemIndex]._component ? 'widgets' : 'filter_none';
      }
    }
  },
  methods: {
    goToItem: function() {
      this.$store.commit( 'goTo', { chapter: this.chapterIndex, item: this.chapterItemIndex } );
      this.$parent.$parent.close();
    }
  }
} );
