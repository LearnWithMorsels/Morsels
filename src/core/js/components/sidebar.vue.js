import Vue from 'resources/Vue';
import Ellipsis from 'utils/Ellipsis';
import 'sidebar-navigation.vue';

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
                //'<button v-on:click.prevent="toggleTheme">' +
                //  '<i class="material-icons">invert_colors</i>' +
                //'</button>' +
              '</div>' +
              //'<transition-group name="fade" tag="div" mode="out-in">' +
              '<div v-show="selectedTab === 0" :key="0" class="sidebar-content">' +
                '<sidebar-navigation :config="course.config" :chapters="content._chapters"></sidebar-navigation>' +
              '</div>' +
              '<div v-show="selectedTab === 1" :key="1" class="sidebar-content">' +
                '<div class="sidebar-list-group">' +
                  '<div class="sidebar-list-group-title">Saved items</div>' +
                  '<div class="sidebar-list-group-items">' +
                    '<div v-for="(saved, index) in savedItems" class="sidebar-list-item">' +
                      '<button v-on:click.prevent="goTo(saved.chapter, saved.item, saved.index)" class="sidebar-list-item-button">' +
                        '<i class="material-icons sidebar-list-item-icon">bookmark</i>' +
                        '<div class="sidebar-list-item-title">' +
                          '<div>{{ saved.title }}</div>' +
                          '<div v-html="ellipsis(flashcard.body, 42)"></div>' +
                        '</div>' +
                      '</button>' +
                    '</div>' +
                  '</div>' +
                '</div>' +
              '</div>' +
              '<div v-show="selectedTab === 2" :key="2" class="sidebar-content">' +
                '<div class="sidebar-list-group">' +
                  '<div class="sidebar-list-group-title">Flashcards</div>' +
                  '<div class="sidebar-list-group-items">' +
                    '<div v-for="(flashcard, index) in flashcards" class="sidebar-list-item">' +
                      '<button v-on:click.prevent="openFlashcard(index)" class="sidebar-list-item-button">' +
                        '<i class="material-icons sidebar-list-item-icon">brightness_1</i>' +
                        '<div class="sidebar-list-item-title">' +
                          '<div>{{ flashcard.title }}</div>' +
                          '<div v-html="ellipsis(flashcard.body, 42)"></div>' +
                        '</div>' +
                      '</button>' +
                    '</div>' +
                  '</div>' +
                '</div>' +
              '</div>' +
              '<div v-show="selectedTab === 3" :key="3" class="sidebar-content">' +
                '<div class="sidebar-list-group">' +
                  //'<div class="sidebar-list-group-title">Language</div>' +
                  '<div class="sidebar-list-group-items">' +
                    '<div v-for="languageCode in languages" class="sidebar-list-item">' +
                      '<label class="sidebar-list-item-button">' +
                        '<div class="sidebar-list-item-icon">' +
                          '<input type="radio" :value="languageCode" v-model="selectedLanguage">' +
                          '<i class="material-icons selected-state">radio_button_checked</i>' +
                          '<i class="material-icons unselected-state">radio_button_unchecked</i>' +
                        '</div>' +
                        '<div class="sidebar-list-item-title">{{ course.languages[languageCode].endonym || course.languages[languageCode].name || languageCode }}</div>' +
                      '</label>' +
                    '</div>' +
                  '</div>' +
                '</div>' +
              '</div>' +
              '<div v-show="selectedTab === 4" :key="4" class="sidebar-content">' +
                '<div class="sidebar-list-group">' +
                  '<input type="search" v-model="searchTerm" placeholder="Search...">' +
                '</div>' +
                '<div class="sidebar-list-group">' +
                  '<div class="sidebar-list-group-title">{{ filteredSearchResults.length }} results found</div>' +
                  '<div class="sidebar-list-group-items">' +
                    '<div v-for="result in filteredSearchResults" class="sidebar-list-item">' +
                      '<button class="sidebar-list-item-button">' +
                        '<i class="material-icons sidebar-list-item-icon">brightness_1</i>' +
                        '<div class="sidebar-list-item-title">' +
                          '<div>Result 1</div>' +
                          '<div>Lorem ipsum</div>' +
                        '</div>' +
                      '</button>' +
                    '</div>' +
                  '</div>' +
                '</div>' +
              '</div>' +
              //'</transition-group>' +
            '</nav>',
  data: function() {
    return {
      selectedLanguage: this.$store.state.language,
      selectedTab: 0,
      searchTerm: ''
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
    },
    filteredSearchResults: function() {
      return Array(29);
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
    ellipsis: Ellipsis,
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
