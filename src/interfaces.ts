export interface Team {
  id: number,
  coachId: number,
  name: string,
  race: string,
  teamValue: number,
  division: string,
  offers: number[],
  rejections: number[]
}

export interface Coach {
  id: number,
  name: string,
  level: string
}