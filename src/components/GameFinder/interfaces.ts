import { Team, Coach } from '@/interfaces'

export type MatchupStatus = 'AVAILABLE' | 'OFFERED' | 'OPPONENT_OFFERED' | 'REJECTED' | 'PLAY'

export interface Matchup {
  matchupKey: string,
  myTeam: {
    coach: Coach,
    team: Team
  },
  opponentTeam: {
    coach: Coach,
    team: Team
  },
  matchupStatus: MatchupStatus
}

export interface TeamIdPair {
  myTeamId: number,
  opponentTeamId: number
}

export interface GameFinderTeam {
  team: Team,
  offers: number[],
  rejections: number[]
}

export interface GameFinderCoachRequest {
  coach: Coach,
  teams: GameFinderTeam[],
  settings: {
    race: {
      allowMirrors: boolean,
      allowedRaces: string[]
    },
    teamValueDifference: number,
    coachLevels: string[]
  }
}

export interface SortingOption {
  key: SortingOptionValue,
  value: string
}

export type SortingOptionValue = 'ANY' | 'MY_TEAM_NAME' | 'MY_TEAM_RACE' | 'MY_TEAM_VALUE' | 'OPPONENT_TEAM_NAME' | 'OPPONENT_TEAM_RACE' | 'OPPONENT_TEAM_VALUE' | 'TV_DIFFERENCE' | 'COACH_LEVEL'

export interface SortingChoices {
  first: SortingOptionValue,
  second: SortingOptionValue,
  third: SortingOptionValue,
  fourth: SortingOptionValue
}