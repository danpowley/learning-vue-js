/* global Vue, fakeFumbblApi */

Vue.component('match', {
  props: ['matchup'],
  template: `
    <div class="gamefinder__match" :class="matchClassObject">

      <div style="float: right;">

        <template v-if="isOpponentOffered">
          <button @click="startMatch">Start Match</button>
          <button @click="rejectMatchup">Reject</button>
        </template>
        <template v-else-if="isAvailable">
          <button @click="offerMatchup">Offer</button>
          <button @click="rejectMatchup">Reject</button>
        </template>
        <template v-else-if="isOffered">
          <button @click="availableMatchup">Cancel Offer</button>
        </template>
        <template v-else-if="isRejected">
          <button @click="availableMatchup">Undo Reject</button>
        </template>
        <template v-else>
          Error, unknown status.
        </template>

      </div>

      <div>
        {{ matchup.name }}
        <span v-show="statusTagClass !== false" class="status-tag" :class="statusTagClass">{{ statusTagText }}</span>
      </div>
      <div style="font-size: smaller; margin-top: 5px;">
        <em>
          ({{ matchup.coachDetails.level }}) {{ matchup.coachDetails.name }}'s {{ matchup.teamValue }}k {{ matchup.race }}
        </em>
      </div>
    </div>
  `,
  computed: {
    matchupKey () {
      return `${this.matchup.myTeamId}-${this.matchup.opponentTeamId}`
    },
    matchClassObject () {
      return {
        matchupOffered: this.matchup.matchupStatus === 'OFFERED',
        matchupRejected: this.matchup.matchupStatus === 'REJECTED',
        opponentOffered: this.matchup.opponentHasOffered
      }
    },
    isOpponentOffered () {
      return this.matchup.opponentHasOffered === true
    },
    isAvailable () {
      return this.matchup.matchupStatus === 'AVAILABLE'
    },
    isOffered () {
      return this.matchup.matchupStatus === 'OFFERED'
    },
    isRejected () {
      return this.matchup.matchupStatus === 'REJECTED'
    },
    isError () {
      return this.matchup.matchupStatus === 'ERROR'
    },
    statusTagClass () {
      if (this.isRejected) {
        return 'status-tag--rejected'
      }
      if (this.isOpponentOffered) {
        return 'status-tag--opponent-offered'
      }
      if (this.isOffered) {
        return 'status-tag--offered'
      }
      return false
    },
    statusTagText () {
      if (this.isRejected) {
        return 'Rejected by you.'
      }
      if (this.isOpponentOffered) {
        return 'Opponent has offered.'
      }
      if (this.isOffered) {
        return 'You have offered.'
      }
      return false
    }
  },
  methods: {
    startMatch () {
      fakeFumbblApi.startMatch(this.matchup.myTeamId, this.matchup.opponentTeamId)
      alert('Sorry, we haven\'t quite got round to this bit!')
    },
    offerMatchup () {
      fakeFumbblApi.offerMatchup(this.matchup.myTeamId, this.matchup.opponentTeamId)
      this.$emit('offer-matchup', this.matchup.myTeamId, this.matchup.opponentTeamId)
    },
    rejectMatchup () {
      fakeFumbblApi.rejectMatchup(this.matchup.myTeamId, this.matchup.opponentTeamId)
      this.$emit('reject-matchup', this.matchup.myTeamId, this.matchup.opponentTeamId)
    },
    availableMatchup () {
      fakeFumbblApi.availableMatchup(this.matchup.myTeamId, this.matchup.opponentTeamId)
      this.$emit('available-matchup', this.matchup.myTeamId, this.matchup.opponentTeamId)
    }
  }
})

Vue.component('team', {
  props: ['team', 'matchupData'],
  data () {
    return {
      allowMirrors: true,
      tvRangeUnder: 1000,
      tvRangeOver: 1000
    }
  },
  template: `
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
        <div v-if="! matchesForTeam.length" class="gamefinder__match">
          No matches found for team (try adjusting the settings below).
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
              <option v-for="tvRange in [50, 100, 150, 200, 300, 500, 1000, 2000]" v-bind:value="tvRange">
                {{ tvRange }}k
              </option>
            </select>
            <label :for="'tv-range-under' + team.id">TV range under</label>
          </div>
          <div style="margin-top: 5px;">
            <select v-model.number="tvRangeOver" type="checkbox" :id="'tv-range-over-' + team.id">
              <option v-for="tvRange in [50, 100, 150, 200, 300, 500, 1000, 2000]" v-bind:value="tvRange">
                {{ tvRange }}k
              </option>
            </select>
            <label :for="'tv-range-over' + team.id">TV range over</label>
          </div>
        </div>
      </template>

    </div>
    `,
  computed: {
    matchesForTeam () {
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

        let matchupStatus = null
        if (matchupTeam.matches.availableTo.includes(this.team.id)) {
          matchupStatus = 'AVAILABLE'
        } else if (matchupTeam.matches.offerMadeBy.includes(this.team.id)) {
          matchupStatus = 'OFFERED'
        } else if (matchupTeam.matches.rejectedBy.includes(this.team.id)) {
          matchupStatus = 'REJECTED'
        }

        if (matchupStatus === null) {
          continue
        }

        const opponentHasOffered = matchupStatus !== 'REJECTED' && matchupTeam.matches.opponentOfferMadeTo.includes(this.team.id)

        const matchup = {
          myTeamId: this.team.id,
          opponentTeamId: matchupTeam.id,
          name: matchupTeam.name,
          race: matchupTeam.race,
          coachDetails: coachDetailsIdLookup.get(matchupTeam.coachId),
          teamValue: matchupTeam.teamValue,
          matchupStatus: matchupStatus,
          opponentHasOffered: opponentHasOffered
        }

        matchups.push(matchup)
      }

      return matchups
    }
  },
  methods: {
    activateTeam () {
      fakeFumbblApi.activateTeam(this.team.id)
      this.team.isActivated = true
    },
    deactivateTeam () {
      fakeFumbblApi.deactivateTeam(this.team.id)
      this.resetTeamInMatches(this.team.id, null)
      this.team.isActivated = false
    },
    resetTeamInMatches (myTeamId, opponentTeamId) {
      const clearValueFromArray = function (array, value) {
        const index = array.indexOf(value)
        if (index > -1) {
          array.splice(index, 1)
        }
      }

      for (const matchupTeam of this.matchupData.teams) {
        if (matchupTeam.id === opponentTeamId || opponentTeamId === null) {
          clearValueFromArray(matchupTeam.matches.availableTo, myTeamId)
          clearValueFromArray(matchupTeam.matches.offerMadeBy, myTeamId)
          clearValueFromArray(matchupTeam.matches.rejectedBy, myTeamId)
          clearValueFromArray(matchupTeam.matches.opponentOfferMadeTo, myTeamId)

          if (opponentTeamId !== null) {
            return matchupTeam.matches
          }
        }
      }
    },
    offerMatchup (myTeamId, opponentTeamId) {
      const matches = this.resetTeamInMatches(myTeamId, opponentTeamId);
      matches.offerMadeBy.push(myTeamId)
    },
    rejectMatchup (myTeamId, opponentTeamId) {
      const matches = this.resetTeamInMatches(myTeamId, opponentTeamId);
      matches.rejectedBy.push(myTeamId)
    },
    availableMatchup (myTeamId, opponentTeamId) {
      const matches = this.resetTeamInMatches(myTeamId, opponentTeamId);
      matches.availableTo.push(myTeamId)
    }
  }
})

Vue.component('game-finder', {
  props: ['myTeams', 'matchupData'],
  template: `
    <div class="gamefinder">
      <div v-for="team in myTeams" :key="team.id">
        <team :team="team" :matchup-data="matchupData"></team>
      </div>
    </div>
  `
})

new Vue({ // eslint-disable-line no-new
  el: '#app',
  data: {
    myTeams: fakeFumbblApi.getMyTeams(),
    matchupData: {}
  },
  computed: {
    activeTeamIds () {
      const activeTeamIds = []
      for (const team of this.myTeams) {
        if (team.isActivated) {
          activeTeamIds.push(team.id)
        }
      }

      return activeTeamIds
    }
  },
  created: function () {
    this.matchupData = fakeFumbblApi.getMatchupData()
    setInterval(function () {
      this.matchupData = fakeFumbblApi.getMatchupDataCheating(this.matchupData, this.activeTeamIds)
    }.bind(this), 5000)
  }
})
