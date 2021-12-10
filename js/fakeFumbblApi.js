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
        name: 'A team',
        race: 'Slaan',
        teamValue: 1100,
        division: 'C',
        isActivated: true
      },
      {
        id: 2,
        name: 'B team',
        race: 'Orc',
        teamValue: 1550,
        division: 'C',
        isActivated: true
      },
      {
        id: 3,
        name: 'C team',
        race: 'Skaven',
        teamValue: 1870,
        division: 'C',
        isActivated: false
      }
    ]
  },
  getMatchupData () {
    console.log('Fetching latest matchup data from FUMBBL API (FUMBBL already notified which teams are active and which matchups rejected).')

    return {
      teams: [
        {
          id: 101,
          name: 'X Team',
          race: 'Imperial Nobility',
          teamValue: 950,
          coachId: 1,
          matches: {
            availableTo: [1, 2, 3],
            offerMadeBy: [],
            rejectedBy: [],
            opponentOfferMadeTo: []
          }
        },
        {
          id: 102,
          name: 'Y Team',
          race: 'Slaan',
          teamValue: 1270,
          coachId: 2,
          matches: {
            availableTo: [1, 2, 3],
            offerMadeBy: [],
            rejectedBy: [],
            opponentOfferMadeTo: []
          }
        },
        {
          id: 103,
          name: 'Z Team',
          race: 'Orc',
          teamValue: 1970,
          coachId: 2,
          matches: {
            availableTo: [1, 2, 3],
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
        }
      ]
    }
  },
  getMatchupDataCheating (matchupData) {
    // this is some trickery to make the demo look like the opponent is making offers.
    // just don't want the offers to clash with matchups that have been rejected.

    console.log('[CHEATING] Fetching latest matchup data from FUMBBL API (FUMBBL already notified which teams are active and which matchups rejected).')
    matchupData.teams[0].matches.opponentOfferMadeTo.push(1)

    // find a matchup where the user hasn't rejected, make an offer from the opponent

    // clear all offers to avoid weird clashes during demo
    matchupData.teams[0].matches.opponentOfferMadeTo = []
    matchupData.teams[1].matches.opponentOfferMadeTo = []
    matchupData.teams[2].matches.opponentOfferMadeTo = []

    // make an offer
    for (const matchupTeam of matchupData.teams) {
      if (!matchupTeam.matches.rejectedBy.includes(1)) {
        // make an offer to my team 1, ok as its not rejected.
        matchupTeam.matches.opponentOfferMadeTo.push(1)
        break
      } else if (!matchupTeam.matches.rejectedBy.includes(2)) {
        // make an offer to my team 2, ok as its not rejected.
        matchupTeam.matches.opponentOfferMadeTo.push(2)
        break
      } else if (!matchupTeam.matches.rejectedBy.includes(3)) {
        // make an offer to my team 3, ok as its not rejected.
        matchupTeam.matches.opponentOfferMadeTo.push(3)
        break
      }
    }

    return matchupData
  }
}
