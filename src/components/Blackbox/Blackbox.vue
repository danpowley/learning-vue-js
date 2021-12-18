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
    },
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
    setInterval(function (this: {coach: Coach}): void {
      console.log('blackbox...')
    }.bind(this), 5000)
  }
});
</script>

<style scoped>
</style>
