<template>
<div style="margin-bottom: 100px;">
  <h2>Blackbox</h2>

  <div v-show="!myTeams.length" style="font-size: larger;">
    No teams available: use the demo settings below to add teams.
  </div>

  <template v-for="team in myTeams">
    <div :key="team.id">
      <input type="checkbox" :id="'blackbox-apply-team-' + team.id" v-model="appliedTeamIds" :value="team.id" />
      <label :for="'blackbox-apply-team-' + team.id">{{ team.name }}</label>
    </div>
  </template>

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
      appliedTeamIds: [] as number[],
      pollingIntervalId: undefined as number | undefined,
    }
  },
  computed: {
    appliedTeams (): Team[] {
      const appliedTeams: Team[] = []
      for (const team of this.myTeams) {
        if (this.appliedTeamIds.includes(team.id)) {
          appliedTeams.push(team)
        }
      }

      return appliedTeams
    }
  },
  created: function (): void {
    this.pollingIntervalId = setInterval(function (this: {coach: Coach, appliedTeams: Team[]}): void {
      axios.post('http://localhost:3000/blackbox/apply', {coach: this.coach, teams: this.appliedTeams})
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
