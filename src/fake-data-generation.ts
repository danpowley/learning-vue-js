import { Coach } from '@/interfaces'

function getRandomInteger(max: number): number {
  return Math.floor(Math.random() * max)
}

function getRandomId(): number {
  return getRandomInteger(1000000)
}

function getRandomArrayElement<Type>(array: Type[]): Type {
  return array[getRandomInteger(array.length)]
}

function getCoachLevels(): string[] {
  return ['Rookie', 'Veteran', 'Experienced', 'Emerging Star', 'Star', 'Super Star', 'Legend']
}

function getRandomLevel(): string {
  return getRandomArrayElement(getCoachLevels())
}

export function getCoach(coachName: string): Coach {
  return {
    id: getRandomId(),
    name: coachName + '_' + getRandomInteger(9999).toString(),
    level: getRandomLevel()
  }
}