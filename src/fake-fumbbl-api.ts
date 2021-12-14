export interface BaseTeam {
  id: number,
  name: string,
  race: string,
  teamValue: number,
  division: string
}

export interface Team extends BaseTeam {
  isActivated: boolean
}

export interface OpponentTeam extends BaseTeam {
  coachId: number,
  matches: MatchSettings
}

export interface MatchSettings {
  availableTo: number[],
  offerMadeBy: number[],
  rejectedBy: number[],
  opponentOfferMadeTo: number[]
}

export interface Coach {
  id: number,
  name: string,
  level: string
}

export interface MatchupData {
  teams: OpponentTeam[],
  coaches: Coach[]
}

export type MatchupStatus = 'AVAILABLE' | 'OFFERED' | 'REJECTED' | 'ERROR' | null;

export interface Matchup {
  myTeamId: number,
  opponentTeamId: number,
  name: string,
  race: string,
  coachDetails: Coach[],
  teamValue: number,
  matchupStatus: MatchupStatus,
  opponentHasOffered: boolean
}

export function getMyTeams (): Team[] {
  console.log('Fetching my Teams from FUMBBL API (remembers which teams were activated from previous occasions).')

  return [
    {
      id: 1,
      name: 'My Great Slaan Team',
      race: 'Slaan',
      teamValue: 1100,
      division: 'C',
      isActivated: true
    },
    {
      id: 2,
      name: 'My Amazing Orc Team',
      race: 'Orc',
      teamValue: 1550,
      division: 'C',
      isActivated: false
    },
    {
      id: 3,
      name: 'My Ace Skaven Team',
      race: 'Skaven',
      teamValue: 1870,
      division: 'C',
      isActivated: true
    },
    {
      id: 4,
      name: 'My Fab Orc Team',
      race: 'Orc',
      teamValue: 1270,
      division: 'C',
      isActivated: true
    }
  ]
}

export function getMatchupData (): MatchupData {
  console.log('Fetching latest matchup data from FUMBBL API (FUMBBL already notified which teams are active and which matchups rejected).')

  return {
    teams: [
      {
        id: 101,
        name: 'Horrible Nobility Team',
        race: 'Imperial Nobility',
        teamValue: 950,
        division: 'C',
        coachId: 1,
        matches: {
          availableTo: [1, 3, 4],
          offerMadeBy: [],
          rejectedBy: [],
          opponentOfferMadeTo: []
        }
      },
      {
        id: 102,
        name: 'Awful Slaan Team',
        race: 'Slaan',
        teamValue: 1270,
        division: 'C',
        coachId: 2,
        matches: {
          availableTo: [1, 3],
          offerMadeBy: [],
          rejectedBy: [],
          opponentOfferMadeTo: []
        }
      },
      {
        id: 103,
        name: 'Dreaded Orc Team',
        race: 'Orc',
        teamValue: 1970,
        division: 'C',
        coachId: 2,
        matches: {
          availableTo: [3, 4],
          offerMadeBy: [],
          rejectedBy: [],
          opponentOfferMadeTo: []
        }
      },
      {
        id: 104,
        name: 'Dreaded Skaven Team',
        race: 'Skaven',
        teamValue: 1970,
        division: 'C',
        coachId: 3,
        matches: {
          availableTo: [1, 4],
          offerMadeBy: [],
          rejectedBy: [],
          opponentOfferMadeTo: []
        }
      }
    ],
    coaches: [
      {
        id: 1,
        name: 'Bob',
        level: 'Star'
      },
      {
        id: 2,
        name: 'Bill',
        level: 'Emerging Star'
      },
      {
        id: 3,
        name: 'Fred',
        level: 'Legend'
      }
    ]
  }
}

export function activateTeam (teamId: number): void {
  console.log('Notifying FUMBBL API that team id is activated', teamId)
}

export function deactivateTeam (teamId: number): void {
  console.log('Notifying FUMBBL API that team id is deactivated', teamId)
}

export function offerMatchup (myTeamId: number, opponentTeamId: number): void {
  console.log('Notifying FUMBBL API that matchup is offered', myTeamId, opponentTeamId)
}

export function rejectMatchup (myTeamId: number, opponentTeamId: number): void {
  console.log('Notifying FUMBBL API that matchup is rejected', myTeamId, opponentTeamId)
}

export function availableMatchup (myTeamId: number, opponentTeamId: number): void {
  console.log('Notifying FUMBBL API that matchup is to return to available (neither offered or rejected)', myTeamId, opponentTeamId)
}

export function startMatch (myTeamId: number, opponentTeamId: number): void {
  console.log('Notifying FUMBBL API that we want to start a match', myTeamId, opponentTeamId)
}

export function getMatchupDataCheating (matchupData: MatchupData, activeTeamIds: number[]): MatchupData {
  // NOT IMPORTANT: just trickery to simulate some opponent activity

  console.log('[CHEATING] Fetching latest matchup data from FUMBBL API (FUMBBL already notified which teams are active and which matchups rejected).')

  // remove an opponent team entirely
  const chanceOfTeamRemove = 0.1
  if (Math.random() < chanceOfTeamRemove) {
    const randomTeamIndex = Math.floor(Math.random() * matchupData.teams.length)
    matchupData.teams.splice(randomTeamIndex, 1)
  }

  // opponent offers
  const makeOffer = function (activeTeamIds: number[], rejectedBy: number[], opponentOfferMadeTo: number[], myTeamId: number): void {
    const chanceOfOffer = 0.05
    if (!activeTeamIds.includes(myTeamId)) {
      return
    }
    if (!rejectedBy.includes(myTeamId) && !opponentOfferMadeTo.includes(myTeamId)) {
      if (Math.random() < chanceOfOffer) {
        opponentOfferMadeTo.push(myTeamId)
      }
    }
  }
  for (const matchupTeam of matchupData.teams) {
    makeOffer(activeTeamIds, matchupTeam.matches.rejectedBy, matchupTeam.matches.opponentOfferMadeTo, 1)
    makeOffer(activeTeamIds, matchupTeam.matches.rejectedBy, matchupTeam.matches.opponentOfferMadeTo, 2)
    makeOffer(activeTeamIds, matchupTeam.matches.rejectedBy, matchupTeam.matches.opponentOfferMadeTo, 3)
    makeOffer(activeTeamIds, matchupTeam.matches.rejectedBy, matchupTeam.matches.opponentOfferMadeTo, 4)

    // Simulate declined offers
    if (Math.random() < 0.1) {
      matchupTeam.matches.opponentOfferMadeTo = []
    }
  }

  // Add a new team
  // no more than 20 teams in circulation total, and not adding on every single api call
  if (activeTeamIds.length > 0 && matchupData.teams.length < 20 && Math.random() < 0.2) {
    let maxTeamId = 0
    for (const matchupTeam of matchupData.teams) {
      if (maxTeamId < matchupTeam.id) {
        maxTeamId = matchupTeam.id
      }
    }
    matchupData.teams.push(makeAFakeTeam(maxTeamId + 1, activeTeamIds))
  }

  return matchupData
}

function makeAFakeTeam (teamId: number, activeTeamIds: number[]): OpponentTeam {
  const words = ['Amazing', 'Beak', 'Lamp', 'Warriors', 'North', 'Green', 'Vicious', 'Triple', 'Iron', 'Golden']
  const word1 = words[Math.floor(Math.random() * words.length)]
  const word2 = words[Math.floor(Math.random() * words.length)]
  const word3 = words[Math.floor(Math.random() * words.length)]
  const teamName = `${word1} ${word2} ${word3}`

  const races = ['Black Orc', 'Goblin', 'Snotling', 'Underworld Denizen', 'Orc', 'Skaven']
  const race = races[Math.floor(Math.random() * races.length)]

  const teamValue = (Math.floor(Math.random() * 20) * 100) + 700

  const coachIds = [1, 2, 3]
  const coachId = coachIds[Math.floor(Math.random() * coachIds.length)]

  // 50/50 whether to match to each of my teams
  const availableTo = []
  for (const activeTeamId of activeTeamIds) {
    if (Math.random() > 0.5) {
      availableTo.push(activeTeamId)
    }
  }

  // always available to at least one of them
  if (availableTo.length === 0) {
    availableTo.push(activeTeamIds[Math.floor(Math.random() * activeTeamIds.length)])
  }

  return {
    id: teamId,
    name: teamName,
    race: race,
    teamValue: teamValue,
    division: 'C',
    coachId: coachId,
    matches: {
      availableTo: availableTo,
      offerMadeBy: [],
      rejectedBy: [],
      opponentOfferMadeTo: []
    }
  }
}