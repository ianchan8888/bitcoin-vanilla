// Websocket middle to create WebSocket connection
import moment from "moment"
import {
    WEBSOCKET_CONNECT,
    WEBSOCKET_DISCONNECT,
    websocketConnected,
    websocketDisconnected,
    websocketError,
    websocketReceiveMessage,
    websocketSubscribe
} from "./websocketActions"

import { receiveRealTimePriceData } from "./realTimePriceDataActions"

const connectWebSocketMiddleware = (url, channel) => (store) => (next) => (action) => {
    let websocket = null
    
    const onOpen = (socket, store, channel) => (event) => {
        store.dispatch(websocketConnected(event, Date()))
        sendMessage(socket, channel)
    }

    const onMessage = (store) => (event) => {
        const parsedData = JSON.parse(event.data)
        
        if (parsedData.e === channel) {
            const { pair, volume, bid, ask, timestamp } = parsedData.data
            const convertedTime = moment.unix(timestamp)
            const priceData = { pair, volume, bid, ask }
            const graphData = {convertedTime:convertedTime._d.toString() , bid, ask}
            store.dispatch(receiveRealTimePriceData(priceData, graphData))
        } else {
            store.dispatch(websocketReceiveMessage(event.type, parsedData))
        }
    }

    const onClose = (store) => (event) => {
        store.dispatch(websocketDisconnected(event, Date()))
    }

    const onError = (store) => (event) => {
        store.dispatch(websocketError(event))
    }

    const sendMessage = (socket, channel) => {
        if (channel === "ticker") {
            store.dispatch(websocketSubscribe(channel))
            socket.send(JSON.stringify({ "channel": channel }))
        } else {
            socket.send(JSON.stringify({ "connection": "clsoe" }))
        }
    }

    switch (action.type) {
        case WEBSOCKET_CONNECT:
            websocket = new WebSocket(url)
            websocket.onopen = onOpen(websocket, store, channel)
            websocket.onmessage = onMessage(store, channel)
            websocket.onclose = onClose(store)
            websocket.onerror = onError(store)
            break
        case WEBSOCKET_DISCONNECT:
            websocket.close()
            break
        default:
            break
    }
    return next(action);
}

export default connectWebSocketMiddleware

