import { FLIGHT_SERVER_WS } from './config'

import { AircraftStatus } from './common/aircraft-status'
import { addOrUpdateAircraft, removeExpiredAircraft } from './stores/aircraft-store'
import { updateHomePosition } from './stores/location-store'

import App from './App.svelte'

const target = document.body
const app = new App({ target })

/* Get the user's current location and update the store. */
navigator.geolocation.getCurrentPosition((position: GeolocationPosition) => {
  const latitude = position.coords.latitude
  const longitude = position.coords.longitude
  updateHomePosition(latitude, longitude)
})

/* Handle incoming aircraft transponder events and update the store. */
let ws: WebSocket = new WebSocket(FLIGHT_SERVER_WS)
ws.onmessage = (event: MessageEvent) => {
  const receivedStatus = AircraftStatus.fromJSON(event.data)
  addOrUpdateAircraft(receivedStatus)
}

/* Set up the timer to expire aircraft in the store that we haven't heard from
   in a while. */
setInterval(removeExpiredAircraft, 5000)

export default app
