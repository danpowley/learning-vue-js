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
    <div class="header">Game Finder</div>
    <div class="content" id="wrapper">
      <div class="teamsheader">
        <div class="title">Teams</div>
      </div>
      <div class="teams">
        <div class="title">My Teams <span class="smalltitletext">(<a href="#" @click="showTeams">Choose teams</a>)</span></div>
        <div class="team team--selected">
          <div class="arrow-right"></div>
          <div class="teamname">Bobbins team</div>
          <div class="teamracevalue"><em>1000k Orc</em></div>
        </div>
        <div class="team">
          <div class="arrow-right"></div>
          <div class="teamname">Great team</div>
          <div class="teamracevalue"><em>1100k Skaven</em></div>
        </div>
        <div class="team">
          <div class="arrow-right"></div>
          <div class="teamname">Amazing team</div>
          <div class="teamracevalue"><em>1400k Goblins</em></div>
        </div>
        <div class="team">
          <div class="arrow-right"></div>
          <div class="teamname">Awesome team</div>
          <div class="teamracevalue"><em>1700k Ogres</em></div>
        </div>
      </div>
      <div class="opponents">
        <div class="title">Opponents</div>
        <div class="opponent">
          <div class="coachheader">
            Jonno (Legend)
          </div>
          <div class="coachteams">
            <div class="coachteam">
              <div>Team 1</div>
              <div class="coachteamrace">Orc 1200k TV</div>
              <div class="offerstatusinfo"><span class="statuslabel statuslabel--offersent">Offer sent</span></div>
            </div>
            <div class="coachteam">
              <div>Team 2</div>
              <div class="coachteamrace">Goblins 1200k TV</div>
              <div class="offerstatusinfo"><span class="statuslabel statuslabel--offersent">Offer sent</span></div>
            </div>
          </div>
        </div>
        <div class="opponent">
          <div class="coachheader">
            Greggo (Legend)
          </div>
          <div class="coachteams">
            <div class="coachteam coachteam--offered">
              <div>Team 3</div>
              <div class="coachteamrace">Imperial Nobility 1200k TV</div>
              <div class="offerstatusinfo"><span class="statuslabel statuslabel--offersent">Offer sent</span></div>
            </div>
            <div class="coachteam">
              <div>Team 4</div>
              <div class="coachteamrace">Skaven 1200k TV</div>
              <div class="offerstatusinfo"><span class="statuslabel statuslabel--offersent">Offer sent</span></div>
            </div>
          </div>
        </div>
      </div>
      <div class="matchoffers">

        <div class="matchoffersheader">
          <div class="title">Match Offers <span class="smalltitletext">(Join the <a href="https://discord.gg/aUzsdgA">Discord</a> server to chat.)</span></div>
        </div>

        <div class="card matchoffer">
          <div class="bothteams">
            <div class="ourteam">
              <div class="coach">
                HimalayaP1C7
              </div>
              <div class="teamdetails">
                <div class="teamname">Bobbins team</div>
                <div class="teamracevalue"><em>1000k Orc</em></div>
              </div>
            </div>
            <div class="theirteam">
              <div class="coach">
                Greggo (L)
              </div>
              <div class="teamdetails">
                <div class="teamname">Team 3</div>
                <div class="teamracevalue"><em>1200k Imperial Nobility</em></div>
              </div>
            </div>
          </div>
          <div class="offerdetails">
            Time remaining for Greggo: <strong>1:57 </strong>
            <span class="statuslabel">Waiting</span>
            <a class="icon cancel">&#x2718;</a>
          </div>
        </div>

        <div class="card matchoffer">
          <div class="bothteams">
            <div class="ourteam">
              <div class="coach">
                HimalayaP1C7
              </div>
              <div class="teamdetails">
                <div class="teamname">Amazing team</div>
                <div class="teamracevalue"><em>1400k Goblin</em></div>
              </div>
            </div>
            <div class="theirteam">
              <div class="coach">
                Bobbo (L)
              </div>
              <div class="teamdetails">
                <div class="teamname">Rubbish team</div>
                <div class="teamracevalue"><em>1500k Dwarf</em></div>
              </div>
            </div>
          </div>
          <div class="offerdetails">
            Time remaining for you: <strong>1:08</strong>
            <a class="icon accept">&#x2714;</a>
            <a class="icon cancel">&#x2718;</a>
            <!-- <a class="icon external">?</a> -->
          </div>
        </div>
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

.gamefinder {
  margin-top: 20px;
  font-size: 14px;
}

.gamefinder .title {
  font-size: 18px
}

.gamefinder .smalltitletext {
    font-size: 14px;
    display: inline-block;
    vertical-align: baseline
}

.gamefinder .statuslabel {
  background-color: #888888;
  color: white;
  font-size: 11px;
  padding: 2px;
}

.gamefinder .statuslabel--offersent {
  background-color: #090;
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

.gamefinder a.icon
{
  margin-left: 8px;
  font-size: 11px;
  border-radius: 50%;
  width: 17px;
  height: 17px;
  text-align: center;
  display: inline-block;
  text-decoration: none;
  cursor: pointer
}

.gamefinder .icon.cancel {
    border: solid #900 2px;
    background: #900;
    color: #fff;
}

/* .gamefinder .icon.external {
    border: solid #009 2px;
    background: #009;
    color: #fff
} */

.gamefinder .icon.accept {
    border: solid #090 2px;
    background: #090;
    color: #fff
}


#wrapper {  display: grid;
  grid-template-columns: 1.2fr 0.9fr 0.9fr;
  grid-template-rows: 1fr auto;
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
  margin-right: 20px;
}










#wrapper .card {
  border: solid 1px #cec4ac;
  /* border-radius: 5px; */
  background-color: white;
}









#wrapper .matchoffers .matchoffer {
  background-color: #e6ddc7;
  margin-bottom: 10px;
}

#wrapper .matchoffers .matchoffersheader {
  border-bottom: solid black 1px;
  margin-bottom: 10px;
}

#wrapper .matchoffers .matchoffer .bothteams {
  display: flex;
}

#wrapper .matchoffers .matchoffer .ourteam {
  width: 50%;
  border-right: solid 1px #cec4ac;
}

#wrapper .matchoffers .matchoffer .theirteam {
  width: 50%;
}

#wrapper .matchoffers .matchoffer .coach {
  font-weight: bold;
  padding: 2px;
  border-bottom: solid 1px #cec4ac;
}

#wrapper .matchoffers .matchoffer .teamdetails {
  padding: 2px;
  background-color: white;
}

#wrapper .matchoffers .matchoffer .offerdetails {
  padding: 2px;
  border-top: solid 1px #cec4ac;
}










#wrapper .teams .title {
  margin-bottom: 5px;
}

#wrapper .teams .team {
  background-color: white;
  border-width: 1px;
  border: solid #cec4ac 1px;
  padding: 4px;
  cursor: pointer;
  margin-bottom: 4px;
}

#wrapper .teams .team:hover, #wrapper .teams .team--selected {
  background-color: #d8f2d8;
  border-color: #090;
}

#wrapper .teams .team .arrow-right {
  width: 0;
  height: 0; 
  border-top: 5px solid transparent;
  border-bottom: 5px solid transparent;
  border-left: 11px solid #090;
  margin: auto 0;
  float: right;
  display: none;
}

#wrapper .teams .team:hover .arrow-right, #wrapper .teams .team--selected .arrow-right {
  display: block;
}




#wrapper .opponents .title {
  margin-bottom: 5px;
}

#wrapper .opponent {
  margin-bottom: 20px;
}

#wrapper .opponent .coachheader {
  font-weight: bold;
  background-color: #e6ddc7;
  border: solid #cec4ac 1px;
  padding: 4px;
}

#wrapper .opponent .coachteams {
  background-color: white;
}

#wrapper .opponent .coachteam {
  border: solid #cec4ac 1px;
  border-top-color: white;
  padding: 4px;
  cursor: pointer;
}

#wrapper .opponent .coachteam:hover, #wrapper .opponent .coachteam--offered {
  background-color: #d8f2d8;
  border-color: #090;
}

#wrapper .opponent .coachteam .offerstatusinfo {
  display: none;
}

#wrapper .opponent .coachteam--offered .offerstatusinfo {
  display: block;
}

#wrapper .opponent .coachteamrace {
  font-style: italic;
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
