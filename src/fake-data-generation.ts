import randomWords from 'random-words'

import { Team, Coach } from '@/interfaces'

function getRandomInteger(max: number): number {
  return Math.floor(Math.random() * max)
}

function getRandomId(): number {
  return getRandomInteger(1000000)
}

function getRandomArrayElement<Type>(array: Type[]): Type {
  return array[getRandomInteger(array.length)]
}

export function getRaces(): string[] {
  return ['Human', 'Imperial Nobility', 'Nurgle', 'Khorne', 'Norse', 'Amazon', 'Wood Elves', 'Dark Elves', 'Tomb Kings', 'Elven Union', 'Black Orc', 'Goblin', 'Snotling', 'Underworld Denizen', 'Orc', 'Skaven']
}

function getRandomRace(): string {
  return getRandomArrayElement(getRaces())
}

function getRandomDivision(): string {
  const divisions = ['C', 'L']
  return getRandomArrayElement(divisions)
}

function getRandomTeamName(): string {
  const randomName = randomWords({min: 2, max: 4}).join(' ');
  return randomName[0].toUpperCase() + randomName.slice(1);
}

export function getCoachLevels(): string[] {
  return ['Rookie', 'Veteran', 'Experienced', 'Emerging Star', 'Star', 'Super Star', 'Legend']
}

function getRandomLevel(): string {
  return getRandomArrayElement(getCoachLevels())
}

export function getRandomTeam(coachId: number): Team {
  return {
    id: getRandomId(),
    coachId: coachId,
    name: getRandomTeamName(),
    race: getRandomRace(),
    teamValue: (getRandomInteger(20) * 100) + 700,
    division: getRandomDivision()
  }
}

export function getCoach(coachName: string): Coach {
  return {
    id: getRandomId(),
    name: coachName,
    level: getRandomLevel()
  }
}
