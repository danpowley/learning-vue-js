import { Team } from '@/interfaces'

export interface BlackboxCurrent {
  drawId: number,
  coachCount: number,
  teamCount: number,
  timeOfNextDraw: Date
}

export interface BlackboxActivation {
  drawId: number,
  teamCount: number
}

export interface BlackboxMatch {
  home: {coachName: string, team: Team},
  away: {coachName: string, team: Team}
}

export interface BlackboxDrawResult {
  drawKey: string,
  date: string,
  matches: BlackboxMatch[]
}