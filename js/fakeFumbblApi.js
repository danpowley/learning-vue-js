const fakeFumbblApi = { // eslint-disable-line no-unused-vars
  activateTeam (teamId) {
    console.log('Notifying FUMBBL API that team id is activated', teamId)
  },
  deactivateTeam (teamId) {
    console.log('Notifying FUMBBL API that team id is deactivated', teamId)
  },
  offerMatchup (myTeamId, opponentTeamId) {
    console.log('Notifying FUMBBL API that matchup is offered', myTeamId, opponentTeamId)
  },
  rejectMatchup (myTeamId, opponentTeamId) {
    console.log('Notifying FUMBBL API that matchup is rejected', myTeamId, opponentTeamId)
  },
  availableMatchup (myTeamId, opponentTeamId) {
    console.log('Notifying FUMBBL API that matchup is to return to available (neither offered or rejected)', myTeamId, opponentTeamId)
  },
  startMatch (myTeamId, opponentTeamId) {
    console.log('Notifying FUMBBL API that we want to start a match', myTeamId, opponentTeamId)
  },
  getMyTeams () {
    console.log('Fetching my Teams from FUMBBL API (remembers which teams were activated from previous occasions).')

    return [
      {
        id: 1,
        name: 'My Great Slaan Team',
        race: 'Slaan',
        teamValue: 1100,
        division: 'C',
        isActivated: true
      },
      {
        id: 2,
        name: 'My Amazing Orc Team',
        race: 'Orc',
        teamValue: 1550,
        division: 'C',
        isActivated: false
      },
      {
        id: 3,
        name: 'My Ace Skaven Team',
        race: 'Skaven',
        teamValue: 1870,
        division: 'C',
        isActivated: true
      },
      {
        id: 4,
        name: 'My Fab Orc Team',
        race: 'Orc',
        teamValue: 1270,
        division: 'C',
        isActivated: true
      }
    ]
  },
  getMatchupData () {
    console.log('Fetching latest matchup data from FUMBBL API (FUMBBL already notified which teams are active and which matchups rejected).')

    return {
      teams: [
        {
          id: 101,
          name: 'Horrible Nobility Team',
          race: 'Imperial Nobility',
          teamValue: 950,
          coachId: 1,
          matches: {
            availableTo: [1, 3, 4],
            offerMadeBy: [],
            rejectedBy: [],
            opponentOfferMadeTo: []
          }
        },
        {
          id: 102,
          name: 'Awful Slaan Team',
          race: 'Slaan',
          teamValue: 1270,
          coachId: 2,
          matches: {
            availableTo: [1, 3],
            offerMadeBy: [],
            rejectedBy: [],
            opponentOfferMadeTo: []
          }
        },
        {
          id: 103,
          name: 'Dreaded Orc Team',
          race: 'Orc',
          teamValue: 1970,
          coachId: 2,
          matches: {
            availableTo: [3, 4],
            offerMadeBy: [],
            rejectedBy: [],
            opponentOfferMadeTo: []
          }
        },
        {
          id: 104,
          name: 'Dreaded Skaven Team',
          race: 'Skaven',
          teamValue: 1970,
          coachId: 3,
          matches: {
            availableTo: [1, 4],
            offerMadeBy: [],
            rejectedBy: [],
            opponentOfferMadeTo: []
          }
        }
      ],
      coaches: [
        {
          id: 1,
          name: 'Bob',
          level: 'Star'
        },
        {
          id: 2,
          name: 'Bill',
          level: 'Emerging Star'
        },
        {
          id: 3,
          name: 'Fred',
          level: 'Legend'
        }
      ]
    }
  },
  getMatchupDataCheating (matchupData, activeTeamIds) {
    // NOT IMPORTANT: just trickery to simulate some opponent activity

    console.log('[CHEATING] Fetching latest matchup data from FUMBBL API (FUMBBL already notified which teams are active and which matchups rejected).')

    // remove an opponent team entirely
    const chanceOfTeamRemove = 0.1
    if (Math.random() < chanceOfTeamRemove) {
      const randomTeamIndex = Math.floor(Math.random() * matchupData.teams.length)
      matchupData.teams.splice(randomTeamIndex, 1)
    }

    // opponent offers
    const chanceOfOffer = 0.05
    const makeOffer = function (activeTeamIds, rejectedBy, opponentOfferMadeTo, myTeamId, chanceOfOffer) {
      if (!activeTeamIds.includes(myTeamId)) {
        return
      }
      if (!rejectedBy.includes(myTeamId) && !opponentOfferMadeTo.includes(myTeamId)) {
        if (Math.random() < chanceOfOffer) {
          opponentOfferMadeTo.push(myTeamId)
        }
      }
    }
    for (const matchupTeam of matchupData.teams) {
      makeOffer(activeTeamIds, matchupTeam.matches.rejectedBy, matchupTeam.matches.opponentOfferMadeTo, 1, chanceOfOffer)
      makeOffer(activeTeamIds, matchupTeam.matches.rejectedBy, matchupTeam.matches.opponentOfferMadeTo, 2, chanceOfOffer)
      makeOffer(activeTeamIds, matchupTeam.matches.rejectedBy, matchupTeam.matches.opponentOfferMadeTo, 3, chanceOfOffer)
      makeOffer(activeTeamIds, matchupTeam.matches.rejectedBy, matchupTeam.matches.opponentOfferMadeTo, 4, chanceOfOffer)

      // Simulate declined offers
      if (Math.random() < 0.1) {
        matchupTeam.matches.opponentOfferMadeTo = []
      }
    }

    // Add a new team
    // no more than 20 teams in circulation total, and not adding on every single api call
    if (matchupData.teams.length < 20 && Math.random() < 0.2) {
      let maxTeamId = 0
      for (const matchupTeam of matchupData.teams) {
        if (maxTeamId < matchupTeam.id) {
          maxTeamId = matchupTeam.id
        }
      }
      matchupData.teams.push(this.makeAFakeTeam(maxTeamId + 1))
    }

    return matchupData
  },
  makeAFakeTeam (teamId) {
    const words = ['Amazing', 'Beak', 'Lamp', 'Warriors', 'North', 'Green', 'Vicious', 'Triple', 'Iron', 'Golden']
    const word1 = words[Math.floor(Math.random() * words.length)]
    const word2 = words[Math.floor(Math.random() * words.length)]
    const word3 = words[Math.floor(Math.random() * words.length)]
    const teamName = `${word1} ${word2} ${word3}`

    const races = ['Black Orc', 'Goblin', 'Snotling', 'Underworld Denizen', 'Orc', 'Skaven']
    const race = races[Math.floor(Math.random() * races.length)]

    const teamValue = (Math.floor(Math.random() * 20) * 100) + 700

    const coachIds = [1, 2, 3]
    const coachId = coachIds[Math.floor(Math.random() * coachIds.length)]

    // 50/50 whether to match to each of my teams
    const availableTo = []
    if (Math.random() > 0.5) {
      availableTo.push(1)
    }
    if (Math.random() > 0.5) {
      availableTo.push(2)
    }
    if (Math.random() > 0.5) {
      availableTo.push(3)
    }
    if (Math.random() > 0.5) {
      availableTo.push(4)
    }
    // always available to at least one of them
    if (availableTo.length === 0) {
      availableTo.push(4)
    }

    return {
      id: teamId,
      name: teamName,
      race: race,
      teamValue: teamValue,
      coachId: coachId,
      matches: {
        availableTo: availableTo,
        offerMadeBy: [],
        rejectedBy: [],
        opponentOfferMadeTo: []
      }
    }
  }
}
