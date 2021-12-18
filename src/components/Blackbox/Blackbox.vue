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

  <div>
    <button @click="applyTeams">Apply teams</button>
  </div>

  <div>
    <button @click="getDrawResults">Get draw results</button>
  </div>

  <template v-for="drawResult in drawResults">
    <div :key="drawResult.drawKey">
      <h3>{{ drawResult.date }}</h3>
      <template v-for="teamPair in drawResult.matches">
        <div :key="teamPair[0].id + '-' + teamPair[1].id">
          <div>{{ teamPair[0] }}</div>
          v's
          <div>{{ teamPair[1] }}</div>
        </div>
      </template>
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
      drawResults: []
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
  methods: {
    applyTeams() {
      axios.post('http://localhost:3000/blackbox/apply', {coach: this.coach, teams: this.appliedTeams})
        .then((response) => {
          console.log(response.data)
        })
    },
    getDrawResults() {
      axios.get('http://localhost:3000/blackbox/draw-results')
        .then((response) => {
          this.drawResults = response.data
        })
    }
  }
});
</script>

<style scoped>
</style>
