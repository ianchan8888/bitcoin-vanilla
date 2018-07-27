import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import registerServiceWorker from './registerServiceWorker';
import './App.css';
import {connect, Provider} from 'react-redux';
import thunkMiddleware from 'redux-thunk';
import { createStore, applyMiddleware } from 'redux'
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
                return response.json()
            })
            .then((json) => {
                dispatch(receiveData(json))
            }).catch((error) => {
                dispatch(receiveError(error))
            })
    }
}


const connected = () => {
    return {
        type: "Connected"
    }
}

const disconnected = () => {
    return {
        type: "Disconnected"
    }
}

const receiveMessage = (msg) => {
    return {
        type: "RECEIVE_MESSAGE",
        msgr,
    }
}

const webSocketApi =  {
    websocket : (url) => {
        return new WebSocket(url)
    }

}

// Create WebSocket connection.
export const connectBlockChainWebSocket = (url) => {
    webSpcketApi.websocket(url)    
    websocket.onopen = () => onOpen()
    websocket.onmessage = (event) => onMessage(event)
    websocket.onerror = (event) => onError(event)
    websocket.onclose = (event) => onClose(event)
    https://exec64.co.uk/blog/websockets_with_redux/
    // function onOpen() {
    //     // sendMessage({
    //     //     "op":"unconfirmed_sub"
    //     // });
    //     console.log("open")
    // }

    // function onMessage(event) {
    //     console.log(JSON.parse(event.data))
    // }

    // function onClose() {
    //     sendMessage({
    //         "op":"unconfirmed_unsub"
    //     });
    // }

    // function sendMessage(msg) {
    //     websocket.send(JSON.stringify(msg))
    // }

    // function onError(event) {
    //     console.log(event)
    // }
}


// Reducers - specify how the application's state changes in response to actions sent to store
// All the application state is stored as a single object
// Design the shape of your application's state 
// We want to store - list of Bitcoin price data

// initial state
const dataInitialState = {
    isFetching: false,
    apiData: {},
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
    msg: {},
    error: ""
}

const blockchainReducer = (state = blockchainInitialState, action) => {
    switch(active.type) {
        case "CONNECTED":
            return Object.assign({}, state, {
                msg: "Welcome"
            })
    }
}

// Store - An object that holds the complete state of your app.
// Pass two arguments to the reducer, current state tree and the action.
// Creates a Redux store that holds the complete state tree of your app.
const store = createStore(
    dataReducer,
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
        thunkMiddleware.withExtraArgument({api}), // They would receive dispatch as an argument and may call it asynchronously. 
        /*
            It is a middleware that looks at every action that passes through the system, and if it’s a function,
            it calls that function. That’s all it does.
        */
        logger
    )
)

// The data lifecycle in any Redux app 
/*
    1. call store.dispatch(action)
    2. The Redux store calls the reducer function you gave it
*/

class App extends Component {
    componentDidMount() {
        const url = `https://api.coindesk.com/v1/bpi/historical/close.json`
        this.props.fetchData(url)
    }

    render() {


        const fetchState = this.props.isFetching
        const {bpi, time} = this.props.apiData
        const updateTime = this.props.lastUpdated
        const error = this.props.error
        
        return (
            <div className="container">
                {fetchState &&
                    <h4>Loading</h4>
                }
                {time &&
                    <Header serverUpdate={time} update={updateTime}/>
                }
                {error &&
                    <p>{error.message}</p>
                }
                {bpi && 
                    <DisplayBox data={bpi} /> 
                }
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
                <h2>Data Updated At: {Object.values(this.props.serverUpdate)[0]}</h2>
                <h2>Local Time: {this.props.update} </h2>
            </header>
        )
    }
}

class Footer extends Component {
    render() {
        return (
            <footer>
                <p>Blockchain Movement</p>
                <table>
                    <thead>
                        <tr>
                            <th>In Address</th>
                            <th>Out Address</th>
                        </tr>
                        <tr>
                            <td>In Address</td>
                            <td>Out Address</td>
                        </tr>
                    </thead>
                </table>
                <h4>Best App</h4>
            </footer>
        )
    }
}

// Tells how to transform the current Redux store state into the props you want to pass to a presentational component you are wrapping.
// If this argument is specified, the new component will subscribe to Redux store updates. This means that any time the store is updated, mapStateToProps will be called. 
const mapStateToProps = (state) => ({
    isFetching: state.isFetching,
    apiData: state.apiData,
    lastUpdated: state.lastUpdated,
    error: state.error
});

// If a function is passed, it will be given dispatch as the first parameter

// React Redux library's connect() function, which provides many useful optimizations to prevent unnecessary re-renders.
// Connects a React component to a Redux store. 
// It returns a new, connected component class for you to use
const ConnectedApp = connect(
    mapStateToProps,
    {fetchData: getData}
)(App)

// Proptypes- runtime checking for React props, to document the intended types of properties passed to components. 

ReactDOM.render(
    <Provider store = {store}> 
        <ConnectedApp />
    </Provider>,
    document.getElementById('root')
);

registerServiceWorker();
