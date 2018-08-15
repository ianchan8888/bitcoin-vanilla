import {
    WEBSOCKET_CONNECT,
    WEBSOCKET_CONNECTED,
    WEBSOCKET_DISCONNECTED,
    WEBSOCKET_DISCONNECT,
    WEBSOCKET_ERROR,
    WEBSOCKET_RECEIVE_MESSAGE,
    WEBSOCKET_SUBSCRIBE
} from "../Actions/websocketActions"

const initialState = {
    wsConnected: false,
    wsStatus: "close",
    channel: "",
    message: "",
    eventTime: "",
}

const websocketReducer = (state = initialState, action) => {
    switch (action.type) {
        case WEBSOCKET_CONNECT:
            return {
                ...state,
                wsConnected: false,
                wsStatus: "connecting",
                eventTime: ""
            }
        case WEBSOCKET_CONNECTED:
            return {
                ...state,
                wsConnected: true,
                wsStatus: action.eventType,
                eventTime: action.connectedAt
            }
        case WEBSOCKET_SUBSCRIBE:
            return {
                ...state,
                wsConnected: true,
                channel: action.channel
            }
        case WEBSOCKET_RECEIVE_MESSAGE:
            return {
                ...state,
                wsConnected: true,
                wsStatus: action.eventType,
                message: action.message.data
            }
        case WEBSOCKET_DISCONNECT:
            return {
                ...state,
                wsConnected: true,
                wsStatus: "disconnecting"
            }
        case WEBSOCKET_DISCONNECTED:
            return {
                ...state,
                wsConnected: false,
                wsStatus: action.eventType,
                channel: "",
                eventTime: action.disconnectedAt
            }
        case WEBSOCKET_ERROR:
            return {
                ...state,
                wsConnected: false,
                wsStatus: action.eventType,
                channel: ""
            }
        default:
            return state
    }
}

export default websocketReducer