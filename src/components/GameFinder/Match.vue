<template>
<div class="gamefinder__match" :class="matchClassObject">
  <div style="float: right;">

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
import { Matchup } from '@/fake-fumbbl-api';
import Vue from 'vue';
import { PropType } from 'vue';

interface MatchClassObject {
  matchupOffered: boolean,
  matchupRejected: boolean,
  opponentOffered: boolean,
  play: boolean
}

export default Vue.extend({
  name: 'Match',
  props: {
    matchup: {
      type: Object as PropType<Matchup>,
      required: true
    }
  },
  computed: {
    matchupKey (): string {
      return `${this.matchup.myTeamId}-${this.matchup.opponentTeamId}`
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
    isOpponentOffered (): boolean {
      return this.matchup.matchupStatus === 'OPPONENT_OFFERED'
    },
    isPlay (): boolean {
      return this.matchup.matchupStatus === 'PLAY'
    },
    matchClassObject (): MatchClassObject {
      return {
        matchupOffered: this.isOffered,
        matchupRejected: this.isRejected,
        opponentOffered: this.isOpponentOffered,
        play: this.isPlay
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
        return 'Opponent has offered.'
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
      this.$emit('offer-matchup', this.matchup.opponentTeamId)
    },
    rejectMatchup () {
      this.$emit('reject-matchup', this.matchup.opponentTeamId)
    },
    availableMatchup () {
      this.$emit('available-matchup', this.matchup.opponentTeamId)
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

.play {
  background-color: rgb(221, 159, 250);
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

.status-tag--play {
  color: white;
  background-color: purple;
}
</style>
