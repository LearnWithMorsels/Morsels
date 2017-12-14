import Vue from 'resources/Vue';
import 'card.vue';

Vue.component( 'component', {
  props: ['chapterIndex', 'componentIndex', 'component', 'isCurrent'],
  template: '<div :class="classes">' +
              '<div class="chapter-item-title">{{ component.title }}</div>' +
              '<component ref="component"' +
                ' :is="componentName"' +
                ' :chapterIndex="chapterIndex"' +
                ' :componentIndex="componentIndex"' +
                ' :component="component"' +
                ' :isCurrent="isCurrent"' +
                ' v-on:completed="complete"></component>' +
            '</div>',
  data: function() {
    return {
      completed: false,
      isMounted: false
    };
  },
  computed: {
    itemCount: function() {
      return 1;
    },
    itemCompletedCount: function() {
      return this.completed ? 1 : 0;
    },
    isComplete: function() {
      return this.completed;
    },
    componentName: function() {
      return 'component-' + this.component._component;
    },
    classes: function() {
      let classes = {
        'chapter-item': true,
        component: true,
        complete: this.isComplete,
        current: this.isCurrent
      };
      classes[this.componentName] = true;
      return classes;
    }
  },
  methods: {
    complete: function() {
      if( !this.completed ) {
        this.completed = true;
        this.$store.dispatch( 'setComplete', {
          chapter: this.chapterIndex,
          item: this.componentIndex
        } );
        this.$emit( 'completed' );
      }
    }
  }
} );
