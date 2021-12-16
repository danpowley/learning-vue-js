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

function getRandomInteger(max: number): number {
  return Math.floor(Math.random() * max)
}

function getRandomId(): number {
  return getRandomInteger(100000)
}

function getRandomArrayElement<Type>(array: Type[]): Type {
  return array[getRandomInteger(array.length)]
}

function getRandomRace(): string {
  const races = ['Human', 'Imperial Nobility', 'Nurgle', 'Khorne', 'Norse', 'Amazon', 'Wood Elves', 'Dark Elves', 'Tomb Kings', 'Elven Union', 'Black Orc', 'Goblin', 'Snotling', 'Underworld Denizen', 'Orc', 'Skaven']
  return getRandomArrayElement(races)
}

function getRandomDivision(): string {
  const divisions = ['C', 'L']
  return getRandomArrayElement(divisions)
}

function getRandomBoolean(): boolean {
  const booleans = [true, false]
  return getRandomArrayElement(booleans)
}

function getRandomTeamName(): string {
  const words = ['Amazing', 'Beak', 'Lamp', 'Warriors', 'North', 'Green', 'Vicious', 'Triple', 'Iron', 'Golden', 'Bright', 'Dark', 'Fearless', 'Lightning']
  return `${getRandomArrayElement(words)} ${getRandomArrayElement(words)} ${getRandomArrayElement(words)}`
}

function getRandomTeam(): Team {
  return {
    id: getRandomId(),
    name: getRandomTeamName(),
    race: getRandomRace(),
    teamValue: (getRandomInteger(20) * 100) + 700,
    division: getRandomDivision(),
    isActivated: getRandomBoolean()
  }
}

export function getCoach(): Coach {
  const words = ['weird', 'purple', 'sour', 'bog', 'paper', 'bird', 'man', 'fish', 'click', 'crack', 'static', 'funk', 'bot', 'trick', 'proud']
  const coachName = `${getRandomArrayElement(words)}${getRandomArrayElement(words)}`
  return {
    id: getRandomId(),
    name: coachName + getRandomInteger(10000),
    level: 'Star'
  }
}

export function getMyTeams (): Team[] {
  console.log('Fetching my Teams from FUMBBL API (remembers which teams were activated from previous occasions).')

  return [
    getRandomTeam(),
    getRandomTeam(),
    getRandomTeam(),
    getRandomTeam(),
    getRandomTeam(),
  ]
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
