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
    console.log(state, 'NEMESIS')
    console.log(action, 'NEMESIS')
  }
  state = { ...state, ...initialState }
  return state
}

// Epics
export const onNemesisStartupEpic = (action$, store) => {
  let cmd =
    'MATCH (e:Persona)<-[r:PCC01]- (f:Persona)\n' +
    'WHERE e.id_persona=15493312\n' +
    'RETURN e, f,r \n' +
    'LIMIT 5;'
  return action$.ofType(STARTUP_CONNECTION_SUCCESS).mapTo(executeCommand(cmd))
}
