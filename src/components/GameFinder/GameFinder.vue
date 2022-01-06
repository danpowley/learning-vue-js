<template>
<div class="gamefinder" style="margin-bottom: 100px;">
  <div class="basicbox" v-show="display == 'teams'">
    <div class="header">Select Teams</div>
    <div class="content" id="teamswrapper">
      <div class="lfgList">
        <div class="lfgteam" v-for="canLfgTeam in canLfgTeams" :key="canLfgTeam.id">
          <input class="teamcheck" type="checkbox" v-model="selectedIsLfgTeamIds" :value="canLfgTeam.id">
          <img :src="'https://fumbbl.com/i/' + canLfgTeam.raceLogos[0].logo" />
          <div class="teamname">{{ canLfgTeam.name }}</div>
          <div class="teaminfo">TV {{ canLfgTeam.teamValue/1000 }}k {{ canLfgTeam.race }}</div>
        </div>
      </div>
      <div class="controls">
        <div id="selectallteams">
            <input type="checkbox" id="allteams" v-model="allTeams" @change="toggleAllTeams" />
            <label for="allteams">Select All</label>
        </div>
        <button @click="confirmCoachTeamsIsLfg">Done</button>
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

        <div class="title">My Teams <span class="smalltitletext">(<a href="#" @click="showCoachTeamsIsLfg">Choose teams</a>)</span></div>

        <div v-show="isLfgTeams.length === 0">
          No teams selected.
        </div>

        <template v-for="team in isLfgTeams">
          <div class="team" :key="team.id" @click="chooseOpponents(team)" :class="{'team--selected': chosenTeam !== null && chosenTeam.id === team.id}">
            <div class="arrow-right"></div>
            <div class="teamname">{{ team.name }}</div>
            <div class="teamracevalue"><em>TV {{ team.teamValue/1000 }}k {{ team.race }}</em></div>
          </div>
        </template>

      </div>

      <div class="opponents">

        <div class="title">Opponents <span class="smalltitletext">({{ chosenTeamName }})</span></div>

        <div v-show="this.loadingOpponents" class="loader"></div>

        <div class="opponent" :class="{ reloading: this.loadingOpponents }">
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
        <!-- <div class="opponent">
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
        </div> -->

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

function getRandomInteger(max: number): number {
  return Math.floor(Math.random() * max)
}

function getRandomId(): number {
  return getRandomInteger(1000000)
}

type Race = 'High Elf' | 'Goblin' | 'Tomb Kings' | 'Chaos Dwarf'
type YesNo = 'Yes' | 'No'
type TeamStatus = 'Active' | 'New' | 'Retired'

interface RaceLogo {
  size: number,
  logo: number
}

interface Team {
  id: number,
  coachId: number,
  name: string,
  rosterId: number,
  race: Race,
  teamValue: number,
  canLfg: YesNo,
  isLfg: YesNo,
  games: string,
  divisionId: number,
  division: string,
  leagueId: number,
  league: null,
  status: TeamStatus,
  raceLogos: RaceLogo[]
}

interface CoachTeams {
  id: number,
  name: string,
  teams: Team[],
}

const api = {
  coachTeamsIsLfg: function (teamIds: number[]) {
    console.log('API: /coach/teams/islfg (new api method', teamIds)
  },
  coachTeams: function (coachName: string, cheatOnlyIsLfgTeamIds: number[]): CoachTeams {
    console.log('API: /coach/teams/{coach}', coachName)
    return {
      id: getRandomId(),
      name: coachName,
      teams: [
        {
          id: 1051434,
          coachId: 257339,
          name: "Suave and Soulless",
          rosterId: 5145,
          race: "Tomb Kings",
          teamValue: 1430000,
          canLfg: "Yes",
          isLfg: cheatOnlyIsLfgTeamIds.includes(1051434) ? 'Yes' : 'No', // CHEAT
          games: "16",
          divisionId: 2,
          division: "Competitive",
          leagueId: 0,
          league: null,
          status: "Active",
          raceLogos: [
            {
              size: 32,
              logo: 486296
            },
          ]
        },
        {
          id: 1054459,
          coachId: 257339,
          name: "Furious Mojo",
          rosterId: 5142,
          race: "Chaos Dwarf",
          teamValue: 1080000,
          canLfg: "Yes",
          isLfg: cheatOnlyIsLfgTeamIds.includes(1054459) ? 'Yes' : 'No', // CHEAT
          games: "3",
          divisionId: 2,
          division: "Competitive",
          leagueId: 0,
          league: null,
          status: "Active",
          raceLogos: [
            {
              size: 32,
              logo: 486248
            },
          ]
        },
        {
          id: 1058152,
          coachId: 257339,
          name: "Day Is Done",
          rosterId: 5145,
          race: "Tomb Kings",
          teamValue: 980000,
          canLfg: "Yes",
          isLfg: cheatOnlyIsLfgTeamIds.includes(1058152) ? 'Yes' : 'No', // CHEAT
          games: "0",
          divisionId: 2,
          division: "Competitive",
          leagueId: 0,
          league: null,
          status: "Active",
          raceLogos: [
            {
              size: 32,
              logo: 486296
            },
          ]
        },
      ]
    }
  }
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
      teams: [] as Team[],
      selectedIsLfgTeamIds: [] as number[],
      chosenTeam: null as Team | null,
      loadingOpponents: false,
      pollingIntervalId: undefined as number | undefined,
    }
  },
  computed: {
    canLfgTeams(): Team[] {
      const canLfgTeams = []
      for (const team of this.teams) {
        if (team.canLfg === 'Yes' && team.status === 'Active') {
          canLfgTeams.push(team)
        }
      }
      return canLfgTeams
    },
    isLfgTeams(): Team[] {
      const isLfgTeams = []
      for (const team of this.teams) {
        if (team.isLfg === 'Yes' && team.status === 'Active') {
          isLfgTeams.push(team)
        }
      }
      return isLfgTeams
    },
    chosenTeamName(): string {
      return this.chosenTeam ? this.chosenTeam.name : 'Please choose team'
    }
  },
  methods: {
    showCoachTeamsIsLfg() {
      this.display = 'teams'
    },
    confirmCoachTeamsIsLfg() {
      api.coachTeamsIsLfg(this.selectedIsLfgTeamIds)
      const coachTeamResult = api.coachTeams(this.coach.name, this.selectedIsLfgTeamIds)
      this.teams = coachTeamResult.teams
      this.chosenTeam = null
      this.display = 'lfg'
    },
    toggleAllTeams() {
      this.selectedIsLfgTeamIds = []
      if (this.allTeams) {
        for (const canLfgTeam of this.canLfgTeams) {
          this.selectedIsLfgTeamIds.push(canLfgTeam.id)
        }
      }
    },
    chooseOpponents(team: Team) {
      this.chosenTeam = team
      this.loadingOpponents = true
      setTimeout(function (this: {loadingOpponents: boolean}): void {
        this.loadingOpponents = false
      }.bind(this), 1000)
    }
  },
  created: function (): void {
    // this.pollingIntervalId = setInterval(function (this: {}): void {
    //   // call fake api
    // }.bind(this), 2000)

    const coachTeamResult = api.coachTeams(this.coach.name, this.selectedIsLfgTeamIds)
    this.teams = coachTeamResult.teams
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
  grid-template-rows: auto 1fr;
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
  border-left: solid #cec4ac 10px;
  padding: 4px;
  cursor: pointer;
  margin-bottom: 4px;
}

#wrapper .teams .team:hover, #wrapper .teams .team--selected {
  border-color: #090;
}

#wrapper .teams .team:hover {
  background-color: #d8f2d8;
}

#wrapper .teams .team--selected:hover {
  background-color: white;
}

#wrapper .teams .team .arrow-right {
  width: 0;
  height: 0; 
  border-top: 7px solid transparent;
  border-bottom: 7px solid transparent;
  border-left: 7px solid #090;
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

.gamefinder .opponent.reloading {
  opacity: 0.2;
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
