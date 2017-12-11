import Vue from 'resources/Vue';

Vue.component( 'sidebar', {
  props: ['course', 'content', 'language', 'flashcards', 'percentageComplete'],
  template: '<nav class="sidebar">' +
              '<header class="sidebar-header">' +
                '<button class="toggle-sidebar" v-on:click.prevent="close">' +
                  '<i class="material-icons">close</i>' +
                '</button>' +
                '<h3>{{ content._content.title }}</h3>' +
                '<p>{{ content._content.description }}</p>' +
                '<div v-if="course.config.features && course.config.features.progress && course.config.features.progress.visible" class="course-progress">' +
                  '<progress max="100" :value="percentageComplete"></progress>' +
                  '<span v-if="course.config.features.progress.percentage" class="course-progress-percentage">{{ percentageCompleteRounded }}%</span>' +
                '</div>' +
              '</header>' +
              '<div class="sidebar-nav">' +
                '<button :class="{ current: selectedTab === 0 }" v-on:click.prevent="selectedTab = 0">' +
                  '<i class="material-icons">explore</i>' +
                '</button>' +
                '<button v-if="course.config.features && course.config.features.saveItems" :class="{ current: selectedTab === 1 }" v-on:click.prevent="selectedTab = 1">' +
                  '<i class="material-icons">bookmark_border</i>' +
                '</button>' +
                '<button :class="{ current: selectedTab === 2 }" v-on:click.prevent="selectedTab = 2">' +
                	'<i class="material-icons">flash_on</i>' +
                '</button>' +
                '<button v-if="languages.length > 1" :class="{ current: selectedTab === 3 }" v-on:click.prevent="selectedTab = 3">' +
                  '<i class="material-icons">language</i>' +
                '</button>' +
                '<button v-if="course.config.features && course.config.features.search" :class="{ current: selectedTab === 4 }" v-on:click.prevent="selectedTab = 4">' +
                  '<i class="material-icons">search</i>' +
                '</button>' +
                '<button v-on:click.prevent="toggleTheme">' +
                  '<i class="material-icons">invert_colors</i>' +
                '</button>' +
              '</div>' +
              //'<transition-group name="fade" tag="div" mode="out-in">' +
              '<div v-show="selectedTab === 0" :key="0" class="sidebar-content">' +
                '<div class="sidebar-list">' +
                  '<div v-for="(chapter, chapterIndex) in content._chapters" class="sidebar-list-item">' +
                    '<button class="sidebar-list-item-button">' +
                      '<div class="sidebar-list-item-title">{{ chapter.title }}</div>' +
                    '</button>' +
                    '<div class="sidebar-list-sub">' +
                      '<div v-for="(item, chapterItemIndex) in chapter._items" class="sidebar-list-sub-item">' +
                        '<button class="sidebar-list-sub-item-button"' +
                            //' :disabled="Math.random() > 0.5"' +
                            ' v-on:click="goTo(chapterIndex, chapterItemIndex)">' +
                          //'<i v-if="Math.random() > 0.5" class="material-icons sidebar-list-sub-item-icon">lock</i>' +
                          '<i class="material-icons sidebar-list-sub-item-icon">{{ item._component ? "widgets" : "filter_none" }}</i>' +
                          //'<i class="material-icons sidebar-list-sub-item-icon">flip_to_front</i>' +
                          //'<i class="material-icons sidebar-list-sub-item-icon">panorama_fish_eye</i>' +
                          //'<i class="material-icons sidebar-list-sub-item-icon">brightness_1</i>' +
                          '<div class="sidebar-list-sub-item-title">{{ item.title }}</div>' +
                          //'<i v-if="Math.random() > 0.5" class="material-icons sidebar-list-sub-item-status">check_circle</i>' +
                        '</button>' +
                      '</div>' +
                    '</div>' +
                  '</div>' +
                '</div>' +
              '</div>' +
              '<div v-show="selectedTab === 1" :key="1" class="sidebar-content">' +
                '<h3>Saved items</h3>' +
                '<div class="saved-items">' +
                  '<div v-for="(saved, index) in savedItems" :key="index">' +
                    '<button v-on:click.prevent="goTo(saved.chapter, saved.item, saved.index)">{{ saved.title }}</button>' +
                  '</div>' +
                '</div>' +
              '</div>' +
              '<div v-show="selectedTab === 2" :key="2" class="sidebar-content">' +
                '<p>FLASH CARDS</p>' +
                '<button v-for="(flashcard, index) in flashcards" v-on:click.prevent="openFlashcard( index )">{{ flashcard.title }}</button>' +
              '</div>' +
              '<div v-show="selectedTab === 3" :key="3" class="sidebar-content">' +
                '<template v-for="languageCode in languages">' +
                  '<label>' +
                    '<input type="radio" :value="languageCode" v-model="selectedLanguage">' +
                    '{{ course.languages[languageCode].endonym || course.languages[languageCode].name || languageCode }}' +
                  '</label>' +
                  '<br>' +
                '</template>' +
              '</div>' +
              '<div v-show="selectedTab === 4" :key="4" class="sidebar-content">' +
                '<p>SEARCH</p>' +
              '</div>' +
              //'</transition-group>' +
            '</nav>',
  data: function() {
    return {
      selectedLanguage: this.$store.state.language,
      selectedTab: 0,
      openItems: []
    };
  },
  computed: {
    languages: function() {
      return Object.keys( this.course.content );
    },
    percentageCompleteRounded: function() {
      return parseInt( this.percentageComplete );
    },
    savedItems: function() {
      return this.$store.state.saved;
    }
  },
  watch: {
    selectedLanguage: function( language, oldLanguage ) {
      this.$store.commit( 'setLanguage', language );
    }
  },
  mounted: function() {
    //console.log( this.$root );
  },
  methods: {
    close: function() {
      this.$emit( 'close' );
    },
    openFlashcard: function( id ) {
      this.$store.commit( 'openFlashcard', id );
    },
    toggleTheme: function() {
      document.documentElement.classList.toggle( 'dark-theme' );
    },
    goTo: function( chapter, item, index ) {
      this.$store.commit( 'goTo', { chapter: chapter, item: item, index: index } );
      this.close();
    }
  }
} );
