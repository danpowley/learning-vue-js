<template>
<div class="gamefinder" style="margin-bottom: 100px;">
  <h2>Game finder</h2>

  <div v-show="!myTeams.length" style="font-size: larger;">
    No teams available: use the demo settings below to add teams.
  </div>
  <div v-for="team in myTeams" :key="team.id">
    <team-component :team="team" :matchup-data="matchupData"></team-component>
  </div>
</div>
</template>

<script lang="ts">
import Vue from 'vue';
import { PropType } from 'vue';
import axios from 'axios'
import TeamComponent from '@/components/Team.vue'
import { Team, Coach, MatchupData } from '@/fake-fumbbl-api'

export default Vue.extend({
  name: 'GameFinder',
  components: {
    TeamComponent
  },
  props: {
    coach: {
      type: Object as PropType<Coach>,
      required: true
    },
    myTeams: {
      type: Array as PropType<Team[]>,
      required: true
    },
  },
  data() {
    return {
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
    // Unusual type hinting on the callback for setInterval, just to suppress warnings.
    setInterval(function (this: { coach: Coach, activeTeams: Team[], matchupData: MatchupData }): void {
      axios.post('http://localhost:3000/coach/apply-teams', {coach: this.coach, teams: this.activeTeams})
        .then((response) => {
          this.matchupData = response.data
        })
    }.bind(this), 5000)
  }
});
</script>

<style scoped>
</style>
