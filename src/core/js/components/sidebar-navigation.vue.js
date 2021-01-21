import Vue from 'resources/Vue';
import 'sidebar-navigation-item.vue';

Vue.component( 'sidebar-navigation', {
  props: ['config', 'chapters'],
  template: '<div class="sidebar-content">' +
                '<div v-for="(chapter, chapterIndex) in chapters" class="sidebar-list-group">' +
                  '<div class="sidebar-list-group-title">{{ chapter.title }}</div>' +
                  '<div class="sidebar-list-group-items">' +
                    '<sidebar-navigation-item v-for="(item, chapterItemIndex) in chapter._items"' +
                      ' :key="chapterItemIndex"' +
                      ' :config="config"' +
                      ' :chapters="chapters"' +
                      ' :chapterIndex="chapterIndex"' +
                      ' :chapterItemIndex="chapterItemIndex"' +
                      ' :item="item"></sidebar-navigation-item>' +
                  '</div>' +
                '</div>' +
              '</div>',
  data: function() {
    return {
    };
  }
} );
