<template>
<tr>
  <td class="match-myteam" style="width: 180px;">
    <div style="font-size: 115%;">{{ matchup.myTeam.team.race }} - {{ matchup.myTeam.team.teamValue }}k 🛈</div>
    <div>{{ matchup.myTeam.team.name }}</div>
  </td>
  <td class="match-oppteam" style="width: 180px;">
    <div style="font-size: 115%;">{{ matchup.opponentTeam.team.race }} - {{ matchup.opponentTeam.team.teamValue }}k 🛈</div>
    <div>{{ matchup.opponentTeam.team.name }}</div>
  </td>
  <td class="match-coach" style="width: 80px;">
    <div style="font-size: 115%;">{{ matchup.opponentTeam.coach.level }}</div>
    {{ matchup.opponentTeam.coach.name }}<br>
  </td>
  <td class="match-tvdiff">
    <div style="font-size: 130%;">
      <strong>{{ matchup.myTeam.team.teamValue > matchup.opponentTeam.team.teamValue ? '&uarr;' : '&darr;' }}</strong>
      {{ Math.abs(matchup.myTeam.team.teamValue - matchup.opponentTeam.team.teamValue) }}
    </div>
  </td>
  <td class="match-status" style="width: 110px; text-align: right;">
    <div v-show="statusTagClass !== false" style="margin-bottom: 3px">
      <span class="status-tag" :class="statusTagClass">{{ statusTagText }}</span>
    </div>
    <template v-if="isOpponentOffered">
      <button @click="offerMatchup">Accept</button>
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
    <template v-else-if="isPlay">
      <button @click="startMatch">Start Match</button>
    </template>
    <template v-else>
      Error, unknown status.
    </template>
  </td>
</tr>
</template>

<script lang="ts">
import { Matchup } from '@/components/GameFinder/interfaces';
import Vue from 'vue';
import { PropType } from 'vue';

export default Vue.extend({
  name: 'Match',
  props: {
    matchup: {
      type: Object as PropType<Matchup>,
      required: true
    }
  },
  computed: {
    isAvailable (): boolean {
      return this.matchup.matchupStatus === 'AVAILABLE'
    },
    isOffered (): boolean {
      return this.matchup.matchupStatus === 'OFFERED'
    },
    isRejected (): boolean {
      return this.matchup.matchupStatus === 'REJECTED'
    },
    isOpponentOffered (): boolean {
      return this.matchup.matchupStatus === 'OPPONENT_OFFERED'
    },
    isPlay (): boolean {
      return this.matchup.matchupStatus === 'PLAY'
    },
    statusTagClass (): string | false {
      if (this.isRejected) {
        return 'status-tag--rejected'
      }
      if (this.isOpponentOffered) {
        return 'status-tag--opponent-offered'
      }
      if (this.isOffered) {
        return 'status-tag--offered'
      }
      if (this.isPlay) {
        return 'status-tag--play'
      }
      return false
    },
    statusTagText (): string | false {
      if (this.isRejected) {
        return 'Rejected by you.'
      }
      if (this.isOpponentOffered) {
        return 'Opponent offered.'
      }
      if (this.isOffered) {
        return 'You have offered.'
      }
      if (this.isPlay) {
        return 'Match agreed.'
      }
      return false
    }
  },
  methods: {
    startMatch () {
      alert('Sorry, we haven\'t quite got round to this bit!')
    },
    offerMatchup () {
      const teamIdPair = {
        myTeamId: this.matchup.myTeam.team.id,
        opponentTeamId: this.matchup.opponentTeam.team.id
      }
      this.$emit('offer-matchup', teamIdPair)
    },
    rejectMatchup () {
      const teamIdPair = {
        myTeamId: this.matchup.myTeam.team.id,
        opponentTeamId: this.matchup.opponentTeam.team.id
      }
      this.$emit('reject-matchup', teamIdPair)
    },
    availableMatchup () {
      const teamIdPair = {
        myTeamId: this.matchup.myTeam.team.id,
        opponentTeamId: this.matchup.opponentTeam.team.id
      }
      this.$emit('available-matchup', teamIdPair)
    }
  }
});
</script>

<style scoped>
.status-tag {
  font-size: smaller;
  padding: 2px 5px;
}

.status-tag--rejected {
  color: white;
  background-color: #aaa;
}

.status-tag--opponent-offered {
  color: white;
  background-color: rgb(0, 121, 0);
}

.status-tag--offered {
  color: white;
  background-color: rgb(255, 174, 0);
}

.status-tag--play {
  color: white;
  background-color: purple;
}

td {
  padding: 4px 20px 4px 0;
  border-bottom: solid black 1px;
}
</style>
