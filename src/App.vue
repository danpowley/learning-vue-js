<template>
  <div id="app">
    <game-finder :my-teams="myTeams" :matchup-data="matchupData"></game-finder>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { MatchupData, getMyTeams, getMatchupData, getMatchupDataCheating } from './fake-fumbbl-api';
import GameFinder from './components/GameFinder.vue'

export default Vue.extend({
  name: 'App',
  components: {
    GameFinder
  },
  data() {
    return {
      myTeams: getMyTeams(),
      matchupData: getMatchupData()
    }
  },
  computed: {
    activeTeamIds (): number[] {
      const activeTeamIds = []
      for (const team of this.myTeams) {
        if (team.isActivated) {
          activeTeamIds.push(team.id)
        }
      }

      return activeTeamIds
    }
  },
  created: function (): void {
    // Unusual type hinting on the callback for setInterval, just to suppress warnings.
    setInterval(function (this: { matchupData: MatchupData, activeTeamIds: number[] }): void {
      this.matchupData = getMatchupDataCheating(this.matchupData, this.activeTeamIds)
    }.bind(this), 5000)
  }
})

</script>

<style>
</style>
