<template>
  <div>
    <h2>Coach: {{ coach.name }}</h2>
    <div>NOTE: Refreshing the page generates a completely new coach identity.</div>
    <game-finder :my-teams="myTeams" :matchup-data="matchupData"></game-finder>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Coach, MatchupData, Team, getCoach, getMyTeams } from './fake-fumbbl-api'
import GameFinder from './components/GameFinder.vue'
import axios from 'axios'

export default Vue.extend({
  name: 'App',
  components: {
    GameFinder
  },
  data() {
    return {
      coach: getCoach(),
      myTeams: [] as Team[],
      matchupData: {teams: [], coaches: []},
    }
  },
  computed: {
    activeTeams (): Team[] {
      const activeTeams: Team[] = []
      for (const team of this.myTeams) {
        if (team.isActivated) {
          activeTeams.push(team)
        }
      }

      return activeTeams
    }
  },
  created: function (): void {
    this.myTeams = getMyTeams(this.coach.id)

    // Unusual type hinting on the callback for setInterval, just to suppress warnings.
    setInterval(function (this: { coach: Coach, activeTeams: Team[], matchupData: MatchupData }): void {
      axios.post('http://localhost:3000/coach/apply-teams', {coach: this.coach, teams: this.activeTeams})
        .then((response) => {
          this.matchupData = response.data
        })
    }.bind(this), 5000)
  }
})
</script>

<style>
</style>
