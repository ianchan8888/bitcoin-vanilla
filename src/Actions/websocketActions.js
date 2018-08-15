//Web socket action creators for real-time prices

export const WEBSOCKET_CONNECT = "WEBSOCKET_CONNECT"
export const WEBSOCKET_CONNECTED = "WEBSOCKET_CONNECTED"
export const WEBSOCKET_SUBSCRIBE = "WEBSOCKET_SUBSCRIBE"
export const WEBSOCKET_DISCONNECT = "WEBSOCKET_DISCONNECT"
export const WEBSOCKET_DISCONNECTED = "WEBSOCKET_DISCONNECTED"
export const WEBSOCKET_RECEIVE_MESSAGE = "WEBSOCKET_RECEIVE_MESSAGE"
export const WEBSOCKET_ERROR = "WEBSOCKET_ERROR"

export const websocketConnect = () => ({
    type: WEBSOCKET_CONNECT
})

export const websocketConnected = (event, time) => ({
    type: WEBSOCKET_CONNECTED,
    eventType: event.type,
    connectedAt: time
})

export const websocketSubscribe = (channel) => ({
    type: WEBSOCKET_SUBSCRIBE,
    channel
})

export const websocketDisconnect = () => ({
    type: WEBSOCKET_DISCONNECT
})

export const websocketDisconnected = (event, time) => ({
    type: WEBSOCKET_DISCONNECTED,
    eventType: event.type,
    disconnectedAt: time
})

export const websocketReceiveMessage = (eventType, message) => ({
    type: WEBSOCKET_RECEIVE_MESSAGE,
    eventType,
    message
})

export const websocketError = (event) => ({
    type: WEBSOCKET_ERROR,
    eventType: event.type
})
