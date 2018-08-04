import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import registerServiceWorker from './registerServiceWorker';
import './App.css';
import {connect, Provider} from 'react-redux';
import thunkMiddleware from 'redux-thunk';
import { createStore, applyMiddleware, combineReducers } from 'redux'
import logger from 'redux-logger'
import PropTypes from 'prop-types'
import Plot from 'react-plotly.js'

// Actions are payloads of information that send data from your application to your store. 

// When an action creator returns a function, that function will get executed by the Redux Thunk middleware. 
// This function doesn't need to be pure; it is thus allowed to have side effects, including executing asynchronous API calls. 
// The function can also dispatch actions—like those synchronous actions we defined earlier.
// With asynchronous code, there is more state to take care of

const requestData = () => {
    return {
        type: "REQUEST_DATA"
    }
}

const receiveData = (json) => {
    return {
        type: "RECEIVE_DATA",
        apiData: json,
        receivedAt: Date()
    }  
}

const receiveError = (error) => {
    return {
        type: "RECEIVE_ERROR",
        error
    }
}

// api
const api = {
    fetchApiData: (url) => {
        return fetch(url)
    }
}

// Thunk action creator
export const getData = (url) => {
    // It passes the dispatch method as an argument to the function,
    // thus making it able to dispatch actions itself.
    return (dispatch, getState, {api}) => {
        dispatch(requestData())
        return api.fetchApiData(url)
            .then((response) => {
                console.debug(`@getData response`)
                console.debug(response)
                return response.json()
            })
            .then((json) => {
                console.debug(`@getData parsed json`)
                console.debug(json)
                dispatch(receiveData(json))
            }).catch((error) => {
                dispatch(receiveError(error))
            })
    }
}

//web socket
const wsConnect = (url, channel) => {
    return {
        type: "WEBSOCKET_CONNECT",
        url,
        channel
    }
}

const wsConnected = (event) => {
    return {
        type: "WEBSOCKET_CONNECTED",
        eventType: event.type,
        connectedAt: Date()
    }
}

const wsSubscribe = (channel) => {
    return {
        type: "WEBSOCKET_SUBSCRIBE",
        channel 
    }
}

const wsUnsubscribe = () => {
    return {
        type: "WEBSOCKET_UNSUBSCRIBE",
    }
}

const wsDisconnecting = () => {
    return {
        type: "WEBSOCKET_DISCONNECTING",
    }
}

const wsDisconnected = (event) => {
    return {
        type: "WEBSOCKET_DISCONNECTED",
        eventType: event.type,
        disconnectedAt: Date()
    }
}

const wsReceiveMessage = (message) => {
    return {
        type: "WEBSOCKET_RECEIVE_MESSAGE",
        message
    }
}

const wsError = (event) => {
    return {
        type: 'WEBSOCKET_ERROR',
        eventType: event.type
    }
}

// Create WebSocket connection.
// The goal of our WebSocket middleware is to allow bi-directional access to a WebSocket connection through the dispatch of actions. 
export const connectBlockchainWebSocketMiddleware = (store) => (next) => (action) => {
    let websocket = null
    const onOpen = (socket, store, channel) => (event) => {
        store.dispatch(wsConnected(event))
        //send message to subscribe to the websocket
        sendMessage(socket, channel)
    }
    
    const onMessage = (store) => (event) => {
        store.dispatch(wsReceiveMessage(event))
    }
    
    const onClose = (store) => (event) =>{
        store.dispatch(wsDisconnected(event))
    }
    
    const onError = (store) => (event) => {
        store.dispatch(wsError(event))
    }
    
    const sendMessage = (socket, channel) => {
        if(channel === "ticker") {
            store.dispatch(wsSubscribe(channel))
            socket.send(JSON.stringify({"channel":channel}))
        } else {
            store.dispatch(wsUnsubscribe())
            socket.send(JSON.stringify({"op":"unconfirmed_unsub"}))
        }
    }

    // User Dispatched Actions
    switch(action.type) {
        case "WEBSOCKET_CONNECT":
            //connect here
            websocket = new WebSocket(action.url)
            websocket.onopen = onOpen(websocket, store, action.channel)
            websocket.onmessage = onMessage(store)
            websocket.onclose = onClose(store)
            websocket.onerror = onError(store)
            break
        case "WEBSOCKET_DISCONNECT":
            store.dispatch(wsDisconnecting())
            websocket.close()
            break
        default:
            break
    }
    return next(action);   
}

// Reducers - specify how the application's state changes in response to actions sent to store
// All the application state is stored as a single object
// Design the shape of your application's state 
// We want to store - list of Bitcoin price data

// initial state
const dataInitialState = {
    isFetching: false,
    apiData: "",
    lastUpdated: "",
    error: ""
}

export const dataReducer = (state = dataInitialState, action) => {
    switch(action.type) {
        case "REQUEST_DATA":
            return Object.assign({}, state, {
                isFetching: true
            })
        case "RECEIVE_DATA":
            return Object.assign({}, state, {
                isFetching: false,
                apiData: action.apiData,
                lastUpdated: action.receivedAt
            })
        case "RECEIVE_ERROR":
            return Object.assign({}, state, {
                isFetching: false,
                error: action.error
            })
        default:
            return state
  }
}

const blockchainInitialState = {
    wsConnected: false,
    wsStatus: "close",
    channel: "",
    message: "",
    eventTime: "",
    blockchainError: ""
}

const blockchainReducer = (state = blockchainInitialState, action) => {
    switch(action.type) {
        case "WEBSOCKET_CONNECT":
            return Object.assign({}, state, {
                wsConnected: false,
                wsStatus: "connecting",
                channel: action.channel
            })
        case "WEBSOCKET_CONNECTED":
            return Object.assign({}, state, {
                wsConnected: true,
                wsStatus: action.eventType,
                eventTime: action.connectedAt
            })
        case "WEBSOCKET_SUBSCRIBE":
            return Object.assign({}, state, {
                wsConnected: true,
                channel: action.channel
            })
        case "WEBSOCKET_RECEIVE_MESSAGE":
            return Object.assign({}, state, {
                wsConnected: true,
                wsStatus: action.message.type,
                message: action.message.data
            })  
        case "WEBSOCKET_DISCONNECTING":
            return Object.assign({}, state, {
                wsConnected: true,
            })
        case "WEBSOCKET_DISCONNECTED":
            return Object.assign({}, state, {
                wsConnected: false,
                wsStatus: action.eventType,
                eventTime: action.disconnectedAt
            })
        case "WEBSOCKET_ERROR":
            return Object.assign({}, state, {
                wsConnected: false,
                wsStatus: action.eventType,
                channel: ""
            })
        default:
            return state
    }
}

const rootReducer = combineReducers({
    dataReducer,
    blockchainReducer
})

// Store - An object that holds the complete state of your app.
// Pass two arguments to the reducer, current state tree and the action.
// Creates a Redux store that holds the complete state tree of your app.
const store = createStore(
    rootReducer,
    /* 
        The key feature of middleware is that it is composable. Multiple middleware can be combined together,
        where each middleware requires no knowledge of what comes before or after it in the chain.
        Each middleware receives Store's dispatch and getState functions as named arguments, and returns a function. 
    */
    applyMiddleware(
        /* 
            middleware is some code you can put between the framework receiving 
            a request, and the framework generating a response.
            It provides a third-party extension point between dispatching an action, 
            and the moment it reaches the reducer.
        */
        logger,
        thunkMiddleware.withExtraArgument({api}), // They would receive dispatch as an argument and may call it asynchronously. 
        /*
            It is a middleware that looks at every action that passes through the system, and if it’s a function,
            it calls that function. That’s all it does.
        */
        connectBlockchainWebSocketMiddleware
    )
)

// The data lifecycle in any Redux app 
/*
    1. call store.dispatch(action)
    2. The Redux store calls the reducer function you gave it
*/

class App extends Component {
    constructor(props) {
        super(props)
        this.state = {date: new Date()}
    }

    componentDidMount() {
        this.timer = setInterval(() => this.tick(), 1000)
        const url = `https://api.coindesk.com/v1/bpi/historical/close.json`
        this.props.fetchData(url)

        const wsUrl = `ws://localhost:4000`
        const channel = "ticker"
        this.props.startWebSocket(wsUrl, channel)
    }

    tick() {
        this.setState({date: new Date()})
    }
    
    render() {
        // From Historial Price API
        const apiFetchState = this.props.isFetching
        const {bpi, time} = this.props.apiData
        const updateTime = this.props.lastUpdated
        const apiError = this.props.error
        
        // BlockChain WebSocket Data
        const wsConnected = this.props.wsConnected
        const wsStatus = this.props.wsStatus
        const channel = this.props.channel
        const wsData = this.props.message
        const eventTime = this.props.eventTime
        const blockchainError = this.props.blockchainError

        return (
            <div className="container">
                <Header localTime={this.state.date} apiServerUpdateTime={time} fetchTime={updateTime} apiFetchState={apiFetchState} 
                        wsConnectState={wsConnected} wsStatus={wsStatus} wsConnectionTime={eventTime} channel={channel}
                />

                {wsConnected && !blockchainError &&  wsData ? (
                    <BlockChainData wsData={wsData} />
                ) : (
                    <p>{blockchainError.message}</p>
                )}
                                
                {bpi && !apiError && !apiFetchState ? (
                    <DisplayBox data={bpi} /> 
                ) : (
                    <p>{apiError.message}</p>
                )}

                <Footer />
            </div>
        )
    }
}

App.propTypes = {
    bpi: PropTypes.object,
    time: PropTypes.object,
    updateTime: PropTypes.string
}

class BlockChainData extends Component {
    constructor(props) {
        super(props)
        this.state = {
            bid: ""
        }
        this.handleChange.bind(this)
    }

    // static getDerivedStateFromProps(props, state) {
    //     console.log(props)
    //     console.log(state)

        
    // }
    handleChange(event) {
        console.log(event.target)
        this.setState({bid:event.target.value})
    }
    render() {
        const parsedData = JSON.parse(this.props.wsData)
        const {bid, ask, volume, pair} = parsedData
        
        return (
            <div>
                <p><b>Trade Pair</b> {pair}</p>
                <p><b>Volume</b> {volume}</p>
                <table>
                    <thead>
                        <tr>
                            <th>Bid</th>
                            <th>Ask</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <div onChange={this.handleChange} value={bid}>
                                    {this.state.bid}
                                </div>
                            </td>
                            <td>
                                {ask}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        )
    }
}

class DisplayBox extends Component {
    render() {
        const date = Object.keys(this.props.data)
        const price = Object.values(this.props.data)

        return (
            <div className="display-box">
                <table>
                    <thead>
                        <tr>
                            <th className="cell">Date</th>
                            <th className="cell">Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        {date.map((date, i) => {
                            const priceData = price[i]
                            return (
                                <tr key={date}>
                                    <td className="cell">{date}</td>
                                    <td className="cell">{priceData}</td>
                                </tr>  
                            )
                        })}
                    </tbody>
                </table>
                <div className="graph">  
                    <Plot 
                        data = {[
                            {
                                x: date,
                                y: price,
                                type: 'scatter',
                                mode: 'lines+points'
                            }
                        ]}
                        layout={ {width: 960, height: 720, title: 'Price'} }
                    />
                </div>              
            </div>
        )
    }
}

DisplayBox.propTypes = {
    date: PropTypes.array,
    price: PropTypes.array
}

class Header extends Component {
    render() {
        return (
            <header>
                <p><b>Local Time: </b>{this.props.localTime.toLocaleTimeString()}</p>
                
                {this.props.apiServerUpdateTime ? (
                    <div>
                        <p><b>API Data Updated At: </b> {Object.values(this.props.apiServerUpdateTime)[0]}</p>
                        <p><b>Data Fetch At: </b> {this.props.fetchTime}</p> 
                    </div>
                ) : (
                    <div>
                        <p><b>Price API is Fetching:</b> {(this.props.apiFetchState).toString()}</p>
                    </div>
                )}

                {this.props.wsConnectState ? (
                    <div>
                        <p><b>WebSocket Connected:</b> {(this.props.wsConnectState).toString()}</p>
                        <p><b>WebSocket Status:</b> {this.props.wsStatus}</p>
                        <p><b>Channel:</b> {this.props.channel}</p>
                        <p><b>WebSocket Connected At:</b> {this.props.wsConnectionTime}</p>
                    </div>
                ) : (
                    <div>
                        <p><b>WebSocket Connected:</b> {(this.props.wsConnectState).toString()}</p>
                        <p><b>WebSocket Status:</b> {this.props.wsStatus}</p>
                        <p><b>WebSocket Disconnected At:</b> {this.props.wsConnectionTime}</p>
                    </div>
                )}
            </header>
        )
    }
}

class Footer extends Component {
    render() {
        return (
            <footer>
                <h4>Best App</h4>
            </footer>
        )
    }
}

// Tells how to transform the current Redux store state into the props you want to pass to a presentational component you are wrapping.
// If this argument is specified, the new component will subscribe to Redux store updates. This means that any time the store is updated, mapStateToProps will be called. 
const mapStateToProps = (state) => {
    const {dataReducer, blockchainReducer} = state
    const {
        isFetching,
        apiData,
        lastUpdated,
        error
    } = dataReducer
    const {
        wsConnected,
        wsStatus,
        channel,
        message,
        eventTime,
        blockchainError
    } = blockchainReducer
    return {
        isFetching,
        apiData,
        lastUpdated,
        error,
        wsConnected,
        wsStatus,
        channel,
        message,
        eventTime,
        blockchainError
    }
}

// If a function is passed, it will be given dispatch as the first parameter

// React Redux library's connect() function, which provides many useful optimizations to prevent unnecessary re-renders.
// Connects a React component to a Redux store. 
// It returns a new, connected component class for you to use
const ConnectedApp = connect(
    mapStateToProps,
    {
        fetchData: getData,
        startWebSocket: wsConnect
    }
)(App)

// Proptypes- runtime checking for React props, to document the intended types of properties passed to components. 

ReactDOM.render(
    <Provider store = {store}> 
        <ConnectedApp />
    </Provider>,
    document.getElementById('root')
);

registerServiceWorker();
