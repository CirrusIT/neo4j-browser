import {
  NAME as CONNECTIONS,
  DISCONNECTED_STATE,
  CONNECTED_STATE,
  PENDING_STATE,
  STARTUP_CONNECTION_SUCCESS,
  STARTUP_CONNECTION_FAILED,
  onLostConnection,
  CONNECT
} from 'src-root/shared/modules/connections/connectionsDuck'
import Rx from 'rxjs/Rx'
import { executeCommand } from 'src-root/shared/modules/commands/commandsDuck'
import { connectEpic } from 'src-root/shared/modules/connections/connectionsDuck'
import { getEncryptionMode } from 'src-root/shared/services/bolt/boltHelpers'
import bolt from 'src-root/shared/services/bolt/bolt'
import { UPDATE_NEMESIS_STYLE_DATA } from 'src-root/shared/modules/grass/grassDuck'
export const NAME = 'nemesis'

const initialState = {
  nemesisConnected: false
}

export function getConnectionData (state, id) {
  // TODO GET DATA FROM coockie
  let data = state[CONNECTIONS].connectionsById[id]
  // data.host
  if (data) {
    data.username = 'admin'
    data.password = 'admin'
  }
  return data
}

// Reducers
export default function (state, action) {
  if (action.type === STARTUP_CONNECTION_FAILED) {
    console.log('Startup failed')
  }
  state = { ...state, ...initialState }
  return state
}

// Epics
export const onNemesisStartupEpic = (action$, store) => {
  const api = {
    fetchDatos: () => {
      let request = fetch(window.localStorage.getItem('nemesis-bi'), {
        credentials: 'same-origin'
      }).then(response => response.json())
      return Rx.Observable.fromPromise(request)
    }
  }
  return action$.ofType(STARTUP_CONNECTION_SUCCESS).mergeMap(action =>
    api
      .fetchDatos() // This returns our Observable wrapping the Promise
      .map(payload => {
        let consulta = payload.consulta
        window.localStorage.setItem(
          'nemesis-vinculados',
          JSON.stringify(payload.vinculados)
        )
        window.localStorage.setItem(
          'nemesis-principal',
          JSON.stringify(payload.principal)
        )
        return executeCommand(consulta)
      })
  )
}
