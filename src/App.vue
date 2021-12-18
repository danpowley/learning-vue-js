<template>
  <div>
    <template v-if="isLoggedIn()">
      <div style="float: right; font-size: 16pt">Coach: {{ coach.name }} ({{ coach.level }})</div>
      <div style="margin-top: 20px;">
        Choose mode:
        <button @click="setSearchModeGameFinder()">Game finder</button>
        <button @click="setSearchModeBlackbox()">Blackbox</button>
      </div>

      <template v-if="isSearchModeGameFinder">
        <game-finder :coach="coach" :my-teams="myTeams"></game-finder>
      </template>
      <template v-if="isSearchModeBlackBox">
        Black box
      </template>
    </template>
    <template v-else>
      <h2>Welcome to the demo</h2>
      <ul>
        <li>Choose a coach name below to simulate logging in.</li>
        <li>Use the generate team button to add 1 or more teams to use for finding games.</li>
        <li>Open another tab to log in as another coach, try to arrange games between tabs.</li>
      </ul>
    </template>

    <hr>

    <h3>Demo settings:</h3>
    <h4>Set Coach (fake sign in)</h4>
    <div>
      <div style="margin-bottom: 10px;">
        <label for="newCoachName">Coach name: </label><input v-model="newCoachName" type="text" id="newCoachName">
        (any name is fine)
      </div>
      <button @click="changeCoach">Set Coach (fake sign in)</button> (just a quick cheat to simulate a login, <strong>this will also reset the demo</strong>).
    </div>

    <h4>Add teams</h4>
    <div>
      <button @click="addRandomTeam">Generate team</button> (just a quick cheat so you can have as many teams as you need)
    </div>

    <template v-if="isLoggedIn()">
      <h4>General demo info</h4>
      <ul>
        <li>Choose a coach name below to simulate logging in.</li>
        <li>Use the generate team button to add 1 or more teams to use for finding games.</li>
        <li>Open another tab to log in as another coach, try to arrange games between tabs.</li>
      </ul>
    </template>

    <div style="padding-bottom: 800px;"></div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Team, getCoach, getRandomTeam } from '@/fake-fumbbl-api'
import GameFinder from '@/components/GameFinder.vue'

export default Vue.extend({
  name: 'App',
  components: {
    GameFinder
  },
  data() {
    return {
      searchMode: 'GAME_FINDER',
      coach: {id: 0, name: 'Please choose coach name below', 'level': 'Rookie'},
      newCoachName: '',
      myTeams: [] as Team[]
    }
  },
  computed: {
    isSearchModeGameFinder (): boolean {
      return this.searchMode === 'GAME_FINDER'
    },
    isSearchModeBlackBox (): boolean {
      return this.searchMode === 'BLACKBOX'
    }
  },
  methods: {
    isLoggedIn() {
      return this.coach.id !== 0
    },
    addRandomTeam() {
      if (this.isLoggedIn()) {
        this.myTeams.push(getRandomTeam(this.coach.id))
      } else {
        alert('Please choose a coach name before you try to add a team')
      }
    },
    changeCoach() {
      if (this.newCoachName) {
        this.coach = getCoach(this.newCoachName)
        this.myTeams = []
      } else {
        alert('Sorry, can\'t be blank.')
      }
    },
    setSearchModeGameFinder() {
      this.searchMode = 'GAME_FINDER'
    },
    setSearchModeBlackbox() {
      this.searchMode = 'BLACKBOX'
    }
  }
})
</script>

<style>
</style>
