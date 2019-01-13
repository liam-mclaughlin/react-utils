
import { socketTypes } from 'actions/types'
import { authenticate, connected, disconnected } from 'actions/socket'
import { setTimeout } from 'core-js/library/web/timers'

const socketMiddleware = function() {
  let socket = null
  let userDisconnected = false

  const onOpen = (ws, store, token) => () => {
    console.log('web socket: opened', token)
    //Send a handshake, or authenticate with remote end
    socket.send(JSON.stringify(authenticate(token)))
    //Tell the store we're connected§
    store.dispatch(connected())
  }

  const onClose = (ws, store) => () => {
    store.dispatch(disconnected(userDisconnected))
    userDisconnected = false
  }

  const onMessage = (ws, store) => evt => {
    //Parse the JSON message received on the websocket
    const msg = JSON.parse(evt.data)
    // We'll pass the message as a json object to the store so the sagas/reducers can act.
    console.log('web socket: received', msg)
    store.dispatch(msg)
  }

  const onSend = action => socket.send(JSON.stringify(action))

  return store => next => action => {
    if (Object.keys(socketTypes).indexOf(action.type) !== -1) {
      switch (action.type) {
        //The user wants us to connect
        case 'CONNECT':
          //Start a new connection to the server
          if (socket != null) {
            // as this is reconnect, we should flag as user disconnected
            userDisconnected = true
            socket.close()
          }
          //Send an action that shows a "connecting..." status for now
          //store.dispatch(actions.connecting())

          //Attempt to connect (we could send a 'failed' action on error)
          socket = new WebSocket(action.url)
          socket.onmessage = onMessage(socket,store)
          socket.onclose = onClose(socket,store)
          socket.onopen = onOpen(socket,store,action.token)
          break

        //The user wants us to disconnect
        case 'DISCONNECT':
          if (socket != null) {
            userDisconnected = true
            socket.close()
          }
          socket = null
          break

        //Send the action to the Websocket.
        default:
          // check the socket state and if not ready
          if (socket == null || socket.readyState !== 1) {
            // wait and retry
            setTimeout(() => {
              store.dispatch(action)
            }, 50)
          } else {
            onSend(action)
          }
      }
      return next(action)
    } else {
      // We will always pass the action to the middleware
      return next(action)
    }
  }

}

export default socketMiddleware
