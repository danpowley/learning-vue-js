<template>
<div class="gamefinder">
  <div v-for="team in myTeams" :key="team.id">
    <hr>
    <team :team="team" :matchup-data="matchupData"></team>
  </div>
</div>
</template>

<script lang="ts">
import Vue from 'vue';
import Team from './Team.vue'

export default Vue.extend({
  name: 'GameFinder',
  components: {
    Team
  },
  props: {
    myTeams: Array,
    matchupData: Object
  },
});
</script>

<style scoped>
</style>
