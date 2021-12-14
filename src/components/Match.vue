<template>
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
</template>

<script lang="ts">
import Vue from 'vue';
import { startMatch, offerMatchup, rejectMatchup, availableMatchup } from '../fake-fumbbl-api';

interface MatchClassObject {
  matchupOffered: boolean,
  matchupRejected: boolean,
  opponentOffered: boolean
}

export default Vue.extend({
  name: 'Match',
  props: {
    matchup: Object
  },
  computed: {
    matchupKey (): string {
      return `${this.matchup.myTeamId}-${this.matchup.opponentTeamId}`
    },
    isOpponentOffered (): boolean {
      return this.matchup.opponentHasOffered === true
    },
    isAvailable (): boolean {
      return this.matchup.matchupStatus === 'AVAILABLE'
    },
    isOffered (): boolean {
      return this.matchup.matchupStatus === 'OFFERED'
    },
    isRejected (): boolean {
      return this.matchup.matchupStatus === 'REJECTED'
    },
    isError (): boolean {
      return this.matchup.matchupStatus === 'ERROR'
    },
    matchClassObject (): MatchClassObject {
      return {
        matchupOffered: this.isOffered,
        matchupRejected: this.isRejected,
        opponentOffered: this.isOpponentOffered
      }
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
      return false
    },
    statusTagText (): string | false {
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
      startMatch(this.matchup.myTeamId, this.matchup.opponentTeamId)
      alert('Sorry, we haven\'t quite got round to this bit!')
    },
    offerMatchup () {
      offerMatchup(this.matchup.myTeamId, this.matchup.opponentTeamId)
      this.$emit('offer-matchup', this.matchup.myTeamId, this.matchup.opponentTeamId)
    },
    rejectMatchup () {
      rejectMatchup(this.matchup.myTeamId, this.matchup.opponentTeamId)
      this.$emit('reject-matchup', this.matchup.myTeamId, this.matchup.opponentTeamId)
    },
    availableMatchup () {
      availableMatchup(this.matchup.myTeamId, this.matchup.opponentTeamId)
      this.$emit('available-matchup', this.matchup.myTeamId, this.matchup.opponentTeamId)
    }
  }
});
</script>

<style scoped>
.gamefinder__match {
  border-top: solid black 1px;
  padding: 5px;
}

.matchupOffered {
  background-color: rgb(255, 229, 173);
}

.matchupRejected {
  background-color: #eee;
}

.opponentOffered {
  background-color: rgb(209, 248, 209);
}

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
</style>
