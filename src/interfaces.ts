export interface Team {
  id: number,
  coachId: number,
  name: string,
  race: string,
  teamValue: number,
  division: string
}

export interface Coach {
  id: number,
  name: string,
  level: string
}