<template>
<div style="margin-bottom: 100px;">
  <h2>Blackbox</h2>

  <div class="blackbox-container">
    <div class="blackbox-state">

      <div class="panel">
        <div class="panel__header">Blackbox State</div>
        <div class="panel__body blackbox-current-info">
          <div>
            <div>
              <template v-if="isActivated">
                Active status: <span class="activated">ACTIVE</span> ({{ activated.teamCount }} team<span v-show="activated.teamCount > 1">s</span>)
              </template>
              <template v-else>
                Active status: <span class="deactivated">NOT ACTIVE</span>
              </template>
            </div>
            <div>Coaches activated: {{ currentInfo.coachCount }}</div>
            <div>Teams activated: {{ currentInfo.teamCount }}</div>
            <div>Time of next draw: {{ currentInfo.timeOfNextDraw ? displayTime(currentInfo.timeOfNextDraw) : '...' }}</div>
            <div>Draw ID: {{ currentInfo.drawId }}</div>
          </div>
        </div>
      </div>

      <div class="panel">
        <div class="panel__header">My Teams</div>
        <div class="panel__body">
          <div v-show="!myTeams.length">
            No teams available.
          </div>
          <template v-for="team in myTeams">
            <div :key="team.id" class="team-choices">
              <div class="team-choice team-choice-input">
                <input type="checkbox" :id="'blackbox-apply-team-' + team.id" v-model="appliedTeamIds" :value="team.id" />
              </div>
              <div class="team-choice team-choice-details">
                <label :for="'blackbox-apply-team-' + team.id">{{ team.name }}</label>
                <br>
                {{ team.teamValue }}k {{ team.race }}
              </div>
            </div>
          </template>
          <template v-if="myTeams.length">
            <div style="padding: 10px;">
              <button @click="activateTeams">{{ isActivated ? 'Change teams' : 'Activate teams' }}</button>
              <template v-if="isActivated">
                <button @click="deactivateTeams" style="float: right;">Deactivate</button>
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
  drawId: number,
  coachCount: number,
  teamCount: number,
  timeOfNextDraw: Date
}

interface BlackboxActivation {
  drawId: number,
  teamCount: number
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
      activated: null as BlackboxActivation | null,
      appliedTeamIds: [] as number[],
      drawResults: [] as BlackboxDrawResult[],
      currentInfo: {} as BlackboxCurrent,
      pollingIntervalId: null as number | null,
    }
  },
  computed: {
    isActivated (): boolean {
      if (this.activated === null) {
        return false
      }

      return this.activated.drawId === this.currentInfo.drawId
    },
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
      if (this.appliedTeams.length > 0) {
        axios.post('http://localhost:3000/blackbox/activate', {coach: this.coach, teams: this.appliedTeams})
        .then((response) => {
          this.activated = response.data
          this.updateCurrentInfoAndDrawResults()
        })
      } else {
        alert('Please select at least 1 team to activate.')
      }
    },
    deactivateTeams() {
      axios.post('http://localhost:3000/blackbox/deactivate', {coach: this.coach})
        .then(() => {
          this.activated = null
          this.updateCurrentInfoAndDrawResults()
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
    },
    updateCurrentInfoAndDrawResults(): void {
      axios.get('http://localhost:3000/blackbox/latest')
        .then((response) => {
          this.currentInfo = response.data.currentInfo
          this.drawResults = response.data.drawResults
        })
    }
  },
  created: function (): void {
    this.updateCurrentInfoAndDrawResults()
    this.pollingIntervalId = setInterval(this.updateCurrentInfoAndDrawResults, 5000)
  },
  destroyed: function (): void {
    if (this.pollingIntervalId) {
      clearInterval(this.pollingIntervalId)
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
}

.blackbox-current-info {
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

.match-result-container {
  display: grid;
  grid-template-columns: 3fr 1fr 3fr;
  grid-template-rows: 1.2fr 0.8fr;
  gap: 0px 0px;
  grid-auto-flow: row;
  grid-template-areas:
    "home-team-name score away-team-name"
    "home-team-details score away-team-details";
  border-bottom: solid black 1px;
  padding: 3px 0;
}

.home-icon { grid-area: home-icon; }
.away-icon { grid-area: away-icon; }
.score { grid-area: score; text-align: center; font-size: x-large; }
.home-team-name { grid-area: home-team-name;  text-align: right; font-size: large; }
.home-team-details { grid-area: home-team-details; text-align: right; }
.away-team-name { grid-area: away-team-name; text-align: left; font-size: large; }
.away-team-details { grid-area: away-team-details; text-align: left; }

</style>
