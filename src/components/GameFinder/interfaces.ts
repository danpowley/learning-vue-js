import { Team, Coach } from '@/interfaces'

export interface MatchupData {
  teams: Team[],
  coaches: Coach[]
}

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