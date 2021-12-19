<template>
<div style="margin-bottom: 100px;">
  <h2>Blackbox</h2>

  <div class="blackbox-container">
    <div class="blackbox-state">
      <div class="panel">
        <div class="panel__header">Blackbox State</div>
        <div class="panel__body">
          <div>
            <div>Coaches: {{ currentInfo.coachCount }}</div>
            <div>Teams: {{ currentInfo.teamCount }}</div>
            <div>Time of next draw: {{ currentInfo.timeOfNextDraw ? displayTime(currentInfo.timeOfNextDraw) : '...' }}</div>
            <div>You are activated: <span :class="{activated: activated, deactivated: !activated}">{{ this.activated ? 'YES' : 'NO' }}</span></div>
            <div>Your teams: {{ this.activated ? appliedTeamIds.length : 0 }}</div>
          </div>
          <div class="subheading">Available teams</div>
          <div v-show="!myTeams.length">
            No teams available.
          </div>
          <template v-for="team in myTeams">
            <div :key="team.id">
              <input type="checkbox" :id="'blackbox-apply-team-' + team.id" v-model="appliedTeamIds" :value="team.id" />
              <label :for="'blackbox-apply-team-' + team.id">{{ team.name }}</label>
            </div>
          </template>
          <template v-if="myTeams.length">
            <div>
              <template v-if="activated">
                <button @click="deactivateTeams">Deactivate</button>
              </template>
              <template v-else>
                <button @click="activateTeams">Activate</button>
              </template>
            </div>
          </template>
        </div>
      </div>
    </div>
    <div class="blackbox-draws">
      <template v-for="drawResult in drawResults">
        <div :key="drawResult.drawKey" class="panel">
          <div class="panel__header">{{ displayDateAndTime(drawResult.date) }}</div>
          <div class="panel__body">
            <template v-for="blackboxMatch in drawResult.matches">
              <div :key="blackboxMatch.home.team.id + '-' + blackboxMatch.away.team.id">
                <div class="match-result-container">
                  <div class="score">
                    <template v-if="coach.name == blackboxMatch.home.coachName || coach.name == blackboxMatch.away.coachName">
                      <button @click="playGame">Play</button>
                    </template>
                    <template v-else>
                      0-0
                    </template>
                  </div>
                  <div class="home-team-name">{{ blackboxMatch.home.team.name }}</div>
                  <div class="home-team-details"><strong>{{ blackboxMatch.home.coachName }}</strong> TV {{ blackboxMatch.home.team.teamValue }}k {{ blackboxMatch.home.team.race }}</div>
                  <div class="away-team-name">{{ blackboxMatch.away.team.name }}</div>
                  <div class="away-team-details">{{ blackboxMatch.away.team.race }} TV {{ blackboxMatch.away.team.teamValue }}k <strong>{{ blackboxMatch.away.coachName }}</strong></div>
                </div>
              </div>
            </template>
          </div>
        </div>
      </template>
    </div>
  </div>

</div>
</template>

<script lang="ts">
import Vue from 'vue';
import { PropType } from 'vue';
import axios from 'axios'
import { Team, Coach } from '@/fake-fumbbl-api'

interface BlackboxCurrent {
  coachCount: number,
  teamCount: number,
  timeOfNextDraw: Date
}

interface BlackboxMatch {
  home: {coachName: string, team: Team},
  away: {coachName: string, team: Team}
}

interface BlackboxDrawResult {
  drawKey: string,
  date: string,
  matches: BlackboxMatch[]
}

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
      activated: false as boolean,
      appliedTeamIds: [] as number[],
      drawResults: [] as BlackboxDrawResult[],
      currentInfo: {} as BlackboxCurrent,
      pollingIntervalIds: [] as number[],
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
    activateTeams() {
      axios.post('http://localhost:3000/blackbox/apply', {coach: this.coach, teams: this.appliedTeams})
        .then(() => {
          this.activated = true
        })
    },
    deactivateTeams() {
      axios.post('http://localhost:3000/blackbox/apply', {coach: this.coach, teams: []})
        .then(() => {
          this.activated = false
        })
    },
    displayDate(dateString: string): string {
      const date = new Date(dateString)
      const month = (date.getMonth() + 1).toString().padStart(2, '0')
      const dayDate = date.getDate().toString().padStart(2, '0')
      return `${date.getFullYear()}-${month}-${dayDate}`
    },
    displayTime(dateString: string): string {
      const date = new Date(dateString)
      const hour = date.getHours().toString().padStart(2, '0')
      const minute = date.getMinutes().toString().padStart(2, '0')
      return `${hour}:${minute}`
    },
    displayDateAndTime(dateString: string): string {
      return `${this.displayDate(dateString)} ${this.displayTime(dateString)}`
    },
    playGame() {
      alert('Sorry, this doesn\'t work yet.')
    }
  },
  created: function (): void {
    let pollingIntervalId = setInterval(function (this: {currentInfo: BlackboxCurrent}): void {
      axios.get('http://localhost:3000/blackbox/current')
        .then((response) => {
          this.currentInfo = response.data
        })
    }.bind(this), 10000)
    this.pollingIntervalIds.push(pollingIntervalId)

    pollingIntervalId = setInterval(function (this: {drawResults: BlackboxDrawResult[]}): void {
      axios.get('http://localhost:3000/blackbox/draw-results')
        .then((response) => {
          this.drawResults = response.data
        })
    }.bind(this), 10000)
    this.pollingIntervalIds.push(pollingIntervalId)
  },
  destroyed: function (): void {
    for (const pollingIntervalId of this.pollingIntervalIds) {
      clearInterval(pollingIntervalId)
    }
  }
});
</script>

<style scoped>
.blackbox-container {
  display: grid;
  grid-template-columns: 0.6fr 1.4fr;
  grid-template-rows: 1fr;
  gap: 0px 0px;
  grid-template-areas:
    "blackbox-state blackbox-draws";
}
.blackbox-state {
  grid-area: blackbox-state;
  margin-right: 20px;
}
.blackbox-draws {
  grid-area: blackbox-draws;
}

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
  padding: 10px;
}

.subheading {
  margin-top: 10px;
  font-size: larger;
}

.activated {
  color: green;
  font-weight: bold;
}

.deactivated {
  color: red;
  font-weight: bold;
}

.match-result-container {
  display: grid;
  grid-template-columns: 3fr 1fr 3fr;
  grid-template-rows: 1.2fr 0.8fr;
  gap: 0px 0px;
  grid-auto-flow: row;
  grid-template-areas:
    "home-team-name score away-team-name"
    "home-team-details score away-team-details";
}

.home-icon { grid-area: home-icon; }
.away-icon { grid-area: away-icon; }
.score { grid-area: score; text-align: center; font-size: x-large; }
.home-team-name { grid-area: home-team-name;  text-align: right; font-size: large; }
.home-team-details { grid-area: home-team-details; text-align: right; }
.away-team-name { grid-area: away-team-name; text-align: left; font-size: large; }
.away-team-details { grid-area: away-team-details; text-align: left; }

</style>
