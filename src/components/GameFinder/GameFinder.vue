<template>
<div class="gamefinder" style="margin-bottom: 100px;">
  <div class="basicbox" v-show="display == 'teams'">
    <div class="header">Select Teams</div>
    <div class="content" id="teamswrapper">
      <div class="lfgList">
        <div class="lfgteam" v-for="lfgTeam in lfgTeams" :key="lfgTeam.id">
          <input class="teamcheck" type="checkbox" v-model="selectedTeamIds" :value="lfgTeam.id">
          <img :src="'https://fumbbl.com/i/' + lfgTeam.raceLogos[0].logo" />
          <div class="teamname">{{ lfgTeam.name }}</div>
          <div class="teaminfo">TV {{ lfgTeam.teamValue/1000 }}k {{ lfgTeam.race }}</div>
        </div>
      </div>
      <div class="controls">
        <div id="selectallteams">
            <input type="checkbox" id="allteams" v-model="allTeams" @change="toggleAllTeams" />
            <label for="allteams">Select All</label>
        </div>
        <button @click="showLfg">Done</button>
      </div>
    </div>
  </div>
  <div class="basicbox" v-show="display == 'lfg'">
    <div class="header">Game Finder (UI/UX test page)</div>
    <div class="content" id="wrapper">
      <div class="teamsheader">
        <div class="title">Teams</div>
      </div>
      <div class="teams">
        <div class="title">My Teams <span class="smalltitletext">(<a href="#" @click="showTeams">Choose teams</a>)</span></div>
      </div>
      <div class="opponents">
        <div class="title">Opponents</div>
      </div>
      <div class="matchoffers">
        <div>
            Join the <a href="https://discord.gg/aUzsdgA">Discord</a> server to chat.
        </div>
        <div class="title">Match Offers</div>
      </div>
    </div>
  </div>
</div>
</template>

<script lang="ts">
import Vue from 'vue';
import { PropType } from 'vue';
// import axios from 'axios'
import { Coach } from '@/interfaces'

interface lfgTeam {
  id: number,
  name: string,
  teamValue: number,
  race: string,
  raceLogos: [{logo: number}]
}

export default Vue.extend({
  name: 'GameFinder',
  components: {
  },
  props: {
    coach: {
      type: Object as PropType<Coach>,
      required: true
    },
  },
  data() {
    return {
      display: 'lfg',
      allTeams: false,
      lfgTeams: [
        {
          id: 1,
          name: 'Bobbins team',
          teamValue: 1500000,
          race: 'Orc',
          raceLogos: [{logo: 486272}]
        },
        {
          id: 2,
          name: 'Mighty team',
          teamValue: 1600000,
          race: 'Skaven',
          raceLogos: [{logo: 486272}]
        },
      ] as lfgTeam[],
      selectedTeamIds: [] as number[],
      pollingIntervalId: undefined as number | undefined,
    }
  },
  computed: {
  },
  methods: {
    showLfg() {
      this.display = 'lfg'
    },
    showTeams() {
      this.display = 'teams'
    },
    toggleAllTeams() {
      this.selectedTeamIds = []
      if (this.allTeams) {
        for (const lfgTeam of this.lfgTeams) {
          this.selectedTeamIds.push(lfgTeam.id)
        }
      }
    }
  },
  created: function (): void {
    // this.pollingIntervalId = setInterval(function (this: {}): void {
    //   // call fake api
    // }.bind(this), 2000)
  },
  destroyed: function (): void {
    clearInterval(this.pollingIntervalId)
  }
});
</script>

<style>

.gamefinder .title {
    font-size: 14pt
}

.gamefinder .smalltitletext {
    font-size: 10pt;
    display: inline-block;
    vertical-align: baseline
}

.gamefinder .basicbox {
    margin: 5px
}

.gamefinder .basicbox .header {
    background: #242;
    color: #fff;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    padding: 0 10px
}

.gamefinder .basicbox .content {
    background: #f8f5e7;
    overflow-y: auto;
    padding: .5em 1em
}


#wrapper {  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 10px 10px;
  grid-auto-flow: row;
  grid-template-areas:
    "matchoffers teamsheader teamsheader"
    "matchoffers teams opponents";
}

#wrapper .teamsheader {
  grid-area: teamsheader;
  border-bottom: solid black 1px;
}

#wrapper .teams {
  grid-area: teams;
}

#wrapper .opponents {
  grid-area: opponents;
}

#wrapper .matchoffers {
  grid-area: matchoffers;
}







.gamefinder #teamswrapper {
    padding: 0
}

.gamefinder #teamswrapper .lfgteam {
    position: relative;
    border-bottom: solid #030 1px;
    height: 35px;
    padding: 2px
}

.gamefinder #teamswrapper .lfgteam input {
    vertical-align: middle;
    display: inline-block
}

.gamefinder #teamswrapper .lfgteam .teamname {
    position: absolute;
    top: 0;
    width: 70%;
    left: 15%;
    font-size: 16px;
    text-align: center
}

.gamefinder #teamswrapper .lfgteam .teaminfo {
    position: absolute;
    bottom: 0;
    width: 70%;
    left: 15%;
    font-size: 12px;
    text-align: center
}

.gamefinder #teamswrapper .controls {
    position: relative;
    padding: 10px;
    text-align: center
}

.gamefinder #teamswrapper .controls #selectallteams {
    position: absolute;
    left: 0;
    vertical-align: middle;
    display: inline-block
}
</style>
