import { apiUrl } from "@/config"

export const gameFinderApiEndpoints = {
  getLfgTeams: apiUrl + '/game-finder/get-lfg-teams',
  applyTeams: apiUrl + '/game-finder/apply-teams',
  sendOffer: apiUrl + '/game-finder/send-offer',
  cancelOffer: apiUrl + '/game-finder/cancel-offer',
  blockOffer: apiUrl + '/game-finder/block-offer',
}