<template>
<div class="gamefinder" style="margin-bottom: 100px;">
  <h2>Game finder</h2>

  <div class="gamefinder-container">
    <div class="gamefinder-settings">

      <div class="panel">
        <div class="panel__header">
          My Teams
        </div>
        <div class="panel__body">
          <template v-for="team in myTeams">
            <div :key="team.id" class="team-choices">
              <div class="team-choice team-choice-input">
                <input type="checkbox" :id="'gamefinder-apply-team-' + team.id" v-model="appliedTeamIds" :value="team.id" />
              </div>
              <div class="team-choice team-choice-details">
                <label :for="'gamefinder-apply-team-' + team.id">{{ team.name }}</label>
                <br>
                {{ team.teamValue }}k {{ team.race }}
              </div>
            </div>
          </template>
        </div>
      </div>

      <div class="panel">
        <div class="panel__header">
          Races
        </div>
        <div class="panel__body">
          <div>
            <input type="checkbox" id="gamefinder-allow-mirrors" v-model="allowMirrors" />
            <label for="'gamefinder-allow-mirrors">Allow mirrors</label>
          </div>
          <hr>
          <template v-for="race in races">
            <div :key="race">
              <div>
                <input type="checkbox" :id="'gamefinder-race-' + race" v-model="appliedRaces" :value="race" />
                <label :for="'gamefinder-race-' + race">{{ race }}</label>
              </div>
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
import { Team, Coach } from '@/interfaces'
import { getRaces } from '@/fake-data-generation'
import { Matchup, MatchupStatus, TeamIdPair, GameFinderCoachRequest } from '@/components/GameFinder/interfaces'

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
      opponentGameFinderCoachRequests: [] as GameFinderCoachRequest[],
      appliedTeamIds: [] as number[],
      offers: [] as TeamIdPair[],
      rejections: [] as TeamIdPair[],
      pollingIntervalId: undefined as number | undefined,
      races: getRaces().sort(),
      appliedRaces: getRaces(),
      allowMirrors: true
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
    gameFinderCoachRequest (): GameFinderCoachRequest {
      const gameFinderTeams = []
      for (const team of this.appliedTeams) {

        const offers = []
        for (const teamPairId of this.offers) {
          if (team.id === teamPairId.myTeamId) {
            offers.push(teamPairId.opponentTeamId)
          }
        }

        const rejections = []
        for (const teamPairId of this.rejections) {
          if (team.id === teamPairId.myTeamId) {
            rejections.push(teamPairId.opponentTeamId)
          }
        }

        gameFinderTeams.push({
          team: team,
          offers: offers,
          rejections: rejections
        })
      }

      return {
        coach: this.coach,
        teams: gameFinderTeams,
        settings: {
          race: {
            allowMirrors: this.allowMirrors,
            allowedRaces: this.appliedRaces
          },
          teamValueDifference: 200,
          coachLevels: []
        }
      }
    },
    availableMatchups (): Matchup[] {
      const matchups = [] as Matchup[]
      const gameFinderCoachRequest = this.gameFinderCoachRequest

      for (const opponentGameFinderCoachRequest of this.opponentGameFinderCoachRequests) {
        for (const opponentGameFinderTeam of opponentGameFinderCoachRequest.teams) {

          // remove any races we have not allowed
          if (! gameFinderCoachRequest.settings.race.allowedRaces.includes(opponentGameFinderTeam.team.race)) {
            continue
          }

          for (const myGameFinderTeam of gameFinderCoachRequest.teams) {

            // remove any races our opponent has not allowed
            if (! opponentGameFinderCoachRequest.settings.race.allowedRaces.includes(myGameFinderTeam.team.race)) {
              continue
            }

            // remove mirrors if either coach rejected mirror matches
            if (! gameFinderCoachRequest.settings.race.allowMirrors || ! opponentGameFinderCoachRequest.settings.race.allowMirrors) {
              if (myGameFinderTeam.team.race === opponentGameFinderTeam.team.race) {
                continue
              }
            }

            let matchupStatus: MatchupStatus = 'AVAILABLE'

            const theyOffered = opponentGameFinderTeam.offers.includes(myGameFinderTeam.team.id)
            const theyRejected = opponentGameFinderTeam.rejections.includes(myGameFinderTeam.team.id)
            const weOffered = myGameFinderTeam.offers.includes(opponentGameFinderTeam.team.id)
            const weRejected = myGameFinderTeam.rejections.includes(opponentGameFinderTeam.team.id)

            if (theyRejected) {
              this.clearOffersAndRejections({myTeamId: myGameFinderTeam.team.id, opponentTeamId: opponentGameFinderTeam.team.id})
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
              matchupKey: `${myGameFinderTeam.team.id}-${opponentGameFinderTeam.team.id}`,
              myTeam: {
                team: myGameFinderTeam.team,
                coach: gameFinderCoachRequest.coach
              },
              opponentTeam: {
                team: opponentGameFinderTeam.team,
                coach: opponentGameFinderCoachRequest.coach
              },
              matchupStatus: matchupStatus,
            }

            matchups.push(matchup)
          }
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
    clearOffersAndRejections (teamIdPair: TeamIdPair): void {
      let index = this.offers.findIndex((x) => x.myTeamId === teamIdPair.myTeamId && x.opponentTeamId  === teamIdPair.opponentTeamId)
      if (index > -1) {
        this.offers.splice(index, 1)
      }

      index = this.rejections.findIndex((x) => x.myTeamId === teamIdPair.myTeamId && x.opponentTeamId  === teamIdPair.opponentTeamId)
      if (index > -1) {
        this.rejections.splice(index, 1)
      }
    },
    offerMatchup (teamIdPair: TeamIdPair) {
      this.clearOffersAndRejections(teamIdPair)
      this.offers.push(teamIdPair)
    },
    rejectMatchup (teamIdPair: TeamIdPair) {
      this.clearOffersAndRejections(teamIdPair)
      this.rejections.push(teamIdPair)
    },
    availableMatchup (teamIdPair: TeamIdPair) {
      this.clearOffersAndRejections(teamIdPair)
    }
  },
  created: function (): void {
    this.pollingIntervalId = setInterval(function (this: { gameFinderCoachRequest: GameFinderCoachRequest, opponentGameFinderCoachRequests: GameFinderCoachRequest[] }): void {
      axios.post('http://localhost:3000/game-finder/apply', this.gameFinderCoachRequest)
        .then((response) => {
          this.opponentGameFinderCoachRequests = response.data
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

.gamefinder-results-table {
  border-collapse: collapse;
  margin-left: 10px;
}

.team-choices {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  width: 100%;
}

.team-choice {
  display: flex;
  flex-direction: column;
  flex-basis: 100%;
  border-bottom: solid black 1px;
}

.team-choice label {
  font-size: 110%;
}

.team-choice-input {
  flex: 1;
}

.team-choice-details {
  flex: 7;
}
</style>
