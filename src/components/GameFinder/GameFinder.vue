<template>
<div class="gamefinder" style="margin-bottom: 100px;">
  <h2>Game finder</h2>

  <div class="gamefinder-container">
    <div class="gamefinder-settings">
      <div class="panel">
        <div class="panel__header">
          My Teams
        </div>
        <div class="panel__body gamefinder-myteams">
          <template v-for="team in myTeams">
            <div :key="team.id">
              <input type="checkbox" :id="'gamefinder-apply-team-' + team.id" v-model="appliedTeamIds" :value="team.id" />
              <label :for="'gamefinder-apply-team-' + team.id">{{ team.name }}</label>
            </div>
          </template>
        </div>
      </div>
    </div>
    <div class="gamefinder-results">
      <div class="panel">
        <div class="panel__header">
          Possible matches
        </div>
        <div class="panel__body">
          <table class="gamefinder-results-table">
          <template v-for="matchup in availableMatchups">
            <tbody :key="matchup.matchupKey">
              <match-component :matchup="matchup" @offer-matchup="offerMatchup" @reject-matchup="rejectMatchup" @available-matchup="availableMatchup"></match-component>
            </tbody>
          </template>
          </table>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script lang="ts">
import Vue from 'vue';
import { PropType } from 'vue';
import axios from 'axios'
import MatchComponent from '@/components/GameFinder/Match.vue'
import { Team, Coach, Matchup, MatchupStatus, MatchupData } from '@/fake-fumbbl-api'

export default Vue.extend({
  name: 'GameFinder',
  components: {
    MatchComponent
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
      matchupData: {teams: [], coaches: []} as MatchupData,
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
    },
    availableMatchups (): Matchup[] {
      const matchups = []
      const coachIdLookup = new Map()

      for (const coach of this.matchupData.coaches) {
        coachIdLookup.set(coach.id, coach)
      }

      for (const matchupTeam of this.matchupData.teams) {
        for (const myTeam of this.appliedTeams) {

          let matchupStatus: MatchupStatus = 'AVAILABLE'

          const theyOffered = matchupTeam.offers.includes(myTeam.id)
          const theyRejected = matchupTeam.rejections.includes(myTeam.id)
          const weOffered = myTeam.offers.includes(matchupTeam.id)
          const weRejected = myTeam.rejections.includes(matchupTeam.id)

          if (theyRejected) {
            this.clearValueFromArray(myTeam.offers, matchupTeam.id)
            this.clearValueFromArray(myTeam.rejections, matchupTeam.id)
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
            matchupKey: `${myTeam.id}-${matchupTeam.id}`,
            myTeam: {
              team: myTeam,
              coach: this.coach
            },
            opponentTeam: {
              team: matchupTeam,
              coach: coachIdLookup.get(matchupTeam.coachId)
            },
            matchupStatus: matchupStatus,
          }

          matchups.push(matchup)
        }
      }

      return matchups
    }
  },
  methods: {
    findMyTeam (teamId: number): Team | null {
      for (const myTeam of this.myTeams) {
        if (myTeam.id === teamId) {
          return myTeam
        }
      }
      return null
    },
    clearValueFromArray (array: number[], value: number): void {
      const index = array.indexOf(value)
      if (index > -1) {
        array.splice(index, 1)
      }
    },
    offerMatchup (myTeamId: number, opponentTeamId: number) {
      const myTeam = this.findMyTeam(myTeamId)
      if (myTeam) {
        this.clearValueFromArray(myTeam.offers, opponentTeamId)
        this.clearValueFromArray(myTeam.rejections, opponentTeamId)
        myTeam.offers.push(opponentTeamId)
      }
    },
    rejectMatchup (myTeamId: number, opponentTeamId: number) {
      const myTeam = this.findMyTeam(myTeamId)
      if (myTeam) {
        this.clearValueFromArray(myTeam.offers, opponentTeamId)
        this.clearValueFromArray(myTeam.rejections, opponentTeamId)
        myTeam.rejections.push(opponentTeamId)
      }
    },
    availableMatchup (myTeamId: number, opponentTeamId: number) {
      const myTeam = this.findMyTeam(myTeamId)
      if (myTeam) {
        this.clearValueFromArray(myTeam.offers, opponentTeamId)
        this.clearValueFromArray(myTeam.rejections, opponentTeamId)
      }
    }
  },
  created: function (): void {
    this.pollingIntervalId = setInterval(function (this: { coach: Coach, appliedTeams: Team[], matchupData: MatchupData }): void {
      axios.post('http://localhost:3000/game-finder/apply', {coach: this.coach, teams: this.appliedTeams})
        .then((response) => {
          this.matchupData = response.data
        })
    }.bind(this), 2000)
  },
  destroyed: function (): void {
    clearInterval(this.pollingIntervalId)
  }
});
</script>

<style scoped>
.panel {
  margin-bottom: 20px;
}

.panel__header {
  background-color: #242;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  color: white;
  padding: 5px;
  text-align: center;
  font-size: larger;
}

.panel__body {
  background-color: #f8f5e7;
}

 .gamefinder-container {
  display: grid;
  grid-template-columns: 0.5fr 1.5fr;
  grid-template-rows: 1fr;
  grid-auto-columns: 1fr;
  gap: 0px 0px;
  grid-auto-flow: row;
  grid-template-areas:
    "gamefinder-settings gamefinder-results";
}

.gamefinder-settings {
  grid-area: gamefinder-settings;
  margin-right: 20px;
}

.gamefinder-results {
  grid-area: gamefinder-results;
}

.gamefinder-myteams {
  padding: 10px;
}

.gamefinder-results-table {
  border-collapse: collapse;
  margin-left: 10px;
}
</style>
