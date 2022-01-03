<template>
  <div>
    <template v-if="isLoggedOut">
      <h4>Log in to the demo (just type any made up coach name)</h4>
      <p>Every tab you open can be a different coach to allow testing making match ups via Game Finder.
      <div>
        <div style="margin-bottom: 10px; font-size: large;">
          <label for="newCoachName">Coach name: </label><input v-model="newCoachName" type="text" id="newCoachName">
          <button @click="logIn">Start (log in)</button>
        </div>
      </div>
    </template>
    <template v-else>
      <div>
        Coach: {{ coach.name }} ({{ coach.level }})
        <button @click="logOut">Log out</button>
      </div>
    </template>

    <template v-if="isSearchModeGameFinder">
      <game-finder :coach="coach"></game-finder>
    </template>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Coach } from '@/interfaces'
import { getCoach } from '@/fake-data-generation'
import GameFinder from '@/components/GameFinder/GameFinder.vue'

export default Vue.extend({
  name: 'App',
  components: {
    GameFinder
  },
  data() {
    return {
      searchMode: 'GAME_FINDER',
      coach: getCoach('Bob') as Coach | null,
      newCoachName: ''
    }
  },
  computed: {
    isLoggedOut (): boolean {
      return this.searchMode === 'LOGGED_OUT'
    },
    isSearchModeGameFinder (): boolean {
      return this.searchMode === 'GAME_FINDER'
    }
  },
  methods: {
    logIn() {
      if (this.newCoachName) {
        this.coach = getCoach(this.newCoachName)
        this.searchMode = 'GAME_FINDER'
        this.newCoachName = ''
      } else {
        alert('Sorry, coach name can\'t be blank.')
      }
    },
    logOut() {
      this.coach = null
      this.searchMode = 'LOGGED_OUT'
      this.newCoachName = ''
    }
  }
})
</script>

<style>
.loader {
  border: 4px solid #f3f3f3; /* Light grey */
  border-top: 4px solid #3498db; /* Blue */
  border-radius: 50%;
  width: 20px;
  height: 20px;
  animation: spin 2s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
