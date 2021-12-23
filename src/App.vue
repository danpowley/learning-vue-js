<template>
  <div>
    <template v-if="isDisconnected">
      <div>
        <h4>Getting things ready...</h4>
        Sorry, please wait, just checking the necessary services are up and running (this can take up to 30 seconds if no-one has been here recently).
        <div class="loader"></div>
      </div>
    </template>
    <template v-else-if="isLoggedOut">
      <h4>Log in to the demo (just type any made up coach name)</h4>
      <p>Every tab you open can be a different coach to allow testing making match ups via Blackbox or Game Finder.
      <div>
        <div style="margin-bottom: 10px; font-size: large;">
          <label for="newCoachName">Coach name: </label><input v-model="newCoachName" type="text" id="newCoachName">
          <button @click="logIn">Start (log in)</button>
        </div>
      </div>
    </template>
    <template v-else>
      <div style="float: right; font-size: 16pt">
        Coach: {{ coach.name }} ({{ coach.level }})
        <button @click="logOut">Log out</button>
      </div>
      <div style="margin-top: 20px;">
        Choose mode:
        <button @click="setSearchModeGameFinder()">Game finder</button>
        <button @click="setSearchModeBlackbox()">Blackbox</button>
        | <button @click="addRandomTeam">Generate team</button>
      </div>
    </template>

    <template v-if="isSearchModeGameFinder">
      <game-finder :coach="coach" :my-teams="myTeams"></game-finder>
    </template>
    <template v-if="isSearchModeBlackBox">
      <blackbox :coach="coach" :my-teams="myTeams"></blackbox>
    </template>

    <div style="padding-bottom: 800px;"></div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import axios from 'axios'
import { apiUrl } from "@/config"
import { Coach, Team } from '@/interfaces'
import { getCoach, getRandomTeam } from '@/fake-data-generation'
import GameFinder from '@/components/GameFinder/GameFinder.vue'
import Blackbox from '@/components/Blackbox/Blackbox.vue'

export default Vue.extend({
  name: 'App',
  components: {
    GameFinder,
    Blackbox
  },
  data() {
    return {
      searchMode: 'DISCONNECTED',
      coach: null as Coach | null,
      newCoachName: '',
      myTeams: [] as Team[]
    }
  },
  computed: {
    isDisconnected (): boolean {
      return this.searchMode === 'DISCONNECTED'
    },
    isLoggedOut (): boolean {
      return this.searchMode === 'LOGGED_OUT'
    },
    isSearchModeGameFinder (): boolean {
      return this.searchMode === 'GAME_FINDER'
    },
    isSearchModeBlackBox (): boolean {
      return this.searchMode === 'BLACKBOX'
    }
  },
  methods: {
    addRandomTeam() {
      if (this.coach) {
        this.myTeams.push(getRandomTeam(this.coach.id))
      }
    },
    logIn() {
      if (this.newCoachName) {
        this.coach = getCoach(this.newCoachName)
        this.myTeams = []
        this.myTeams.push(getRandomTeam(this.coach.id))
        this.myTeams.push(getRandomTeam(this.coach.id))
        this.myTeams.push(getRandomTeam(this.coach.id))
        this.searchMode = 'GAME_FINDER'
        this.newCoachName = ''
      } else {
        alert('Sorry, coach name can\'t be blank.')
      }
    },
    logOut() {
      this.coach = null
      this.myTeams = []
      this.searchMode = 'LOGGED_OUT'
      this.newCoachName = ''
    },
    setSearchModeGameFinder() {
      this.searchMode = 'GAME_FINDER'
    },
    setSearchModeBlackbox() {
      this.searchMode = 'BLACKBOX'
    }
  },
  created: function () {
    axios.get(apiUrl + '/available')
        .then((response) => {
          if (response.data.available === true) {
            this.searchMode = 'LOGGED_OUT'
          }
        })
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
