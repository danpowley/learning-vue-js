<template>
<div style="margin-bottom: 100px;">
  <h2>Blackbox component</h2>

  <div v-show="!myTeams.length" style="font-size: larger;">
    No teams available: use the demo settings below to add teams.
  </div>
</div>
</template>

<script lang="ts">
import Vue from 'vue';
import { PropType } from 'vue';
import axios from 'axios'
import { Team, Coach } from '@/fake-fumbbl-api'

export default Vue.extend({
  name: 'Blackbox',
  props: {
    coach: {
      type: Object as PropType<Coach>,
      required: true
    },
    myTeams: {
      type: Array as PropType<Team[]>,
      required: true
    }
  },
  data() {
    return {
      pollingIntervalId: undefined as number | undefined,
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
    this.pollingIntervalId = setInterval(function (this: {coach: Coach, activeTeams: Team[]}): void {
      axios.post('http://localhost:3000/blackbox/apply', {coach: this.coach, teams: this.activeTeams})
        .then((response) => {
          console.log(response.data)
        })
    }.bind(this), 5000)
  },
  destroyed: function (): void {
    clearInterval(this.pollingIntervalId)
  }
});
</script>

<style scoped>
</style>
