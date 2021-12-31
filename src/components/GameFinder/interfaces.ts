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
  teams: GameFinderTeam[]
}