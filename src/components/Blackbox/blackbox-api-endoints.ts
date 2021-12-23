import { apiUrl } from "@/config"

export const blackboxApiEndpoints = {
  latest: apiUrl + '/blackbox/latest',
  activate: apiUrl + '/blackbox/activate',
  deactivate: apiUrl + '/blackbox/deactivate',
}