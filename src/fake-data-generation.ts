import randomWords from 'random-words'

import { Team, Coach } from '@/interfaces'

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

function getRandomTeamName(): string {
  const randomName = randomWords({min: 2, max: 4}).join(' ');
  return randomName[0].toUpperCase() + randomName.slice(1);
}

function getRandomLevel(): string {
  const levels = ['Rookie', 'Veteran', 'Experienced', 'Emerging Star', 'Star', 'Super Star', 'Legend']
  return getRandomArrayElement(levels)
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
