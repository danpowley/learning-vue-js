<template>
<div class="gamefinder__team">
  <div class="gamefinder__teamheader">

    <template v-if="team.isActivated">
      <button class="gamefinder__deactivate" @click="deactivateTeam">Deactivate Team</button>
    </template>
    <template v-else>
      <button class="gamefinder__activate" @click="activateTeam">Activate Team</button>
    </template>

    [{{ team.division }}] {{ team.name }}<br>
    <span style="font-size: smaller;"><em>TV {{ team.teamValue }}k {{ team.race }}</em></span>

  </div>

  <template v-if="team.isActivated">
    <div v-if="! matchesForTeam.length" class="gamefinder__searching">
      <span class="status-tag status-tag--searching">Searching...</span> No matches found for team (try adjusting the settings below).
    </div>
    <div v-for="matchup in matchesForTeam" :key="matchup.matchupKey">
      <match :matchup="matchup" @offer-matchup="offerMatchup" @reject-matchup="rejectMatchup" @available-matchup="availableMatchup"></match>
    </div>
    <div class="gamefinder__matchSettings">
      <div><strong>Settings</strong></div>
      <div style="margin-top: 5px;">
        <input v-model="allowMirrors" type="checkbox" :id="'allow-mirror-' + team.id"> <label :for="'allow-mirror-' + team.id">Allow mirrors</label>
      </div>
      <div style="margin-top: 5px;">
        <select v-model.number="tvRangeUnder" type="checkbox" :id="'tv-range-under-' + team.id">
          <option v-for="tvRange in [50, 100, 150, 200, 300, 500, 1000, 2000]" v-bind:value="tvRange" v-bind:key="tvRange">
            {{ tvRange }}k
          </option>
        </select>
        <label :for="'tv-range-under' + team.id">TV range under</label>
      </div>
      <div style="margin-top: 5px;">
        <select v-model.number="tvRangeOver" type="checkbox" :id="'tv-range-over-' + team.id">
          <option v-for="tvRange in [50, 100, 150, 200, 300, 500, 1000, 2000]" v-bind:value="tvRange" v-bind:key="tvRange">
            {{ tvRange }}k
          </option>
        </select>
        <label :for="'tv-range-over' + team.id">TV range over</label>
      </div>
    </div>
  </template>

</div>
</template>

<script lang="ts">
import Vue from 'vue';
import Match from './Match.vue'
import { Matchup, MatchupStatus } from '../fake-fumbbl-api';

export default Vue.extend({
  name: 'Team',
  components: {
    Match
  },
  props: {
    team: Object,
    matchupData: Object
  },
  data () {
    return {
      allowMirrors: true,
      tvRangeUnder: 1000,
      tvRangeOver: 1000
    }
  },
  computed: {
    matchesForTeam (): Matchup[] {
      const matchups = []
      const coachDetailsIdLookup = new Map()

      for (const coachDetails of this.matchupData.coaches) {
        coachDetailsIdLookup.set(coachDetails.id, coachDetails)
      }

      for (const matchupTeam of this.matchupData.teams) {
        if (this.allowMirrors === false && this.team.race === matchupTeam.race) {
          continue
        }

        if (matchupTeam.teamValue < this.team.teamValue - this.tvRangeUnder || matchupTeam.teamValue > this.team.teamValue + this.tvRangeOver) {
          continue
        }

        let matchupStatus: MatchupStatus = 'AVAILABLE'

        const theyOffered = matchupTeam.offers.includes(this.team.id)
        const theyRejected = matchupTeam.rejections.includes(this.team.id)
        const weOffered = this.team.offers.includes(matchupTeam.id)
        const weRejected = this.team.rejections.includes(matchupTeam.id)

        if (theyRejected) {
          this.resetTeamOffersAndRejections(matchupTeam.id)
          continue
        }

        if (weOffered && theyOffered) {
          matchupStatus = 'PLAY'
        } else if (weOffered) {
          matchupStatus = 'OFFERED'
        } else if (weRejected) {
          matchupStatus = 'REJECTED'
        } else if (theyOffered) {
          matchupStatus = 'OPPONENT_OFFERED'
        }

        const matchup: Matchup = {
          myTeamId: this.team.id,
          opponentTeamId: matchupTeam.id,
          name: matchupTeam.name,
          race: matchupTeam.race,
          coachDetails: coachDetailsIdLookup.get(matchupTeam.coachId),
          teamValue: matchupTeam.teamValue,
          matchupStatus: matchupStatus,
        }

        matchups.push(matchup)
      }

      return matchups
    }
  },
  methods: {
    activateTeam (): void {
      this.team.isActivated = true
    },
    deactivateTeam (): void {
      this.team.offers = []
      this.team.rejections = []
      this.team.isActivated = false
    },
    resetTeamOffersAndRejections (opponentTeamId: number): void {
      const clearValueFromArray = function (array: number[], value: number): void {
        const index = array.indexOf(value)
        if (index > -1) {
          array.splice(index, 1)
        }
      }

      clearValueFromArray(this.team.offers, opponentTeamId)
      clearValueFromArray(this.team.rejections, opponentTeamId)
    },
    offerMatchup (opponentTeamId: number) {
      this.resetTeamOffersAndRejections(opponentTeamId)
      this.team.offers.push(opponentTeamId)
    },
    rejectMatchup (opponentTeamId: number) {
      this.resetTeamOffersAndRejections(opponentTeamId)
      this.team.rejections.push(opponentTeamId)
    },
    availableMatchup (opponentTeamId: number) {
      this.resetTeamOffersAndRejections(opponentTeamId)
    }
  }
});
</script>

<style scoped>
.gamefinder__activate {
  float: right;
}

.gamefinder__deactivate {
  float: right;
}

.gamefinder__team {
  background-color: white;
  margin-bottom: 20px;
  border: solid black 1px;
}

.gamefinder__teamheader {
  font-size: larger;
  border-bottom: solid green 8px;
  padding: 5px;
}

.gamefinder__matchSettings {
  border-top: solid black 1px;
  padding: 5px;
}

.gamefinder__searching {
  border-top: solid black 1px;
  padding: 5px;
}

.status-tag {
  font-size: smaller;
  padding: 2px 5px;
}

.status-tag--searching {
  color: white;
  background-color: rgb(0, 121, 0);
}
</style>
