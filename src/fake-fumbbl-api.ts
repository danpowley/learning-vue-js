export interface Team {
  id: number,
  coachId: number,
  name: string,
  race: string,
  teamValue: number,
  division: string,
  offers: [],
  rejections: [],
  isActivated: boolean,
}

export interface Coach {
  id: number,
  name: string,
  level: string
}

export interface MatchupData {
  teams: Team[],
  coaches: Coach[]
}

export type MatchupStatus = 'AVAILABLE' | 'OFFERED' | 'OPPONENT_OFFERED' | 'REJECTED' | 'PLAY'

export interface Matchup {
  myTeamId: number,
  opponentTeamId: number,
  name: string,
  race: string,
  coachDetails: Coach[],
  teamValue: number,
  matchupStatus: MatchupStatus
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

function getRandomLevel(): string {
  const levels = ['Veteran', 'Experienced', 'Emerging Star', 'Star', 'Super Star', 'Legend']
  return getRandomArrayElement(levels)
}

export function getRandomTeam(coachId: number): Team {
  return {
    id: getRandomId(),
    coachId: coachId,
    name: getRandomTeamName(),
    race: getRandomRace(),
    teamValue: (getRandomInteger(20) * 100) + 700,
    division: getRandomDivision(),
    isActivated: getRandomBoolean(),
    offers: [],
    rejections: []
  }
}

export function getCoach(): Coach {
  const words = ['weird', 'purple', 'sour', 'bog', 'paper', 'bird', 'man', 'fish', 'click', 'crack', 'static', 'funk', 'bot', 'trick', 'proud']
  const coachName = `${getRandomArrayElement(words)}${getRandomArrayElement(words)}`
  return {
    id: getRandomId(),
    name: coachName + getRandomInteger(10000),
    level: getRandomLevel()
  }
}
