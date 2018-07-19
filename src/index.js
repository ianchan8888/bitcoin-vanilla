import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
// import App from './App';
import registerServiceWorker from './registerServiceWorker';
import './App.css';
import {connect, Provider} from 'react-redux';
import thunkMiddleware from 'redux-thunk';
import { createStore, applyMiddleware } from 'redux'
import logger from 'redux-logger'

// import logo from './logo.svg';

// const url = "https://www.quandl.com/api/v3/datasets/BCHARTS/"
// const exchange = "BITSTAMP"
// const currency = "USD"

// Actions are payloads of information that send data from your application to your store. 

// When an action creator returns a function, that function will get executed by the Redux Thunk middleware. 
// This function doesn't need to be pure; it is thus allowed to have side effects, including executing asynchronous API calls. 
// The function can also dispatch actions—like those synchronous actions we defined earlier.
// With asynchronous code, there is more state to take care of

const receiveData = (json) => {
  return {
    type: "RECEIVE_DATA",
    apiData: json,
    receivedAt: Date.now()
  }  
}

// Thunk action creator
const getData = () => {
    // It passes the dispatch method as an argument to the function,
    // thus making it able to dispatch actions itself.
    return (dispatch) => {
      return fetch(`https://api.coindesk.com/v1/bpi/historical/close.json`)
        .then(response => response.json())
        .then(json => {
          dispatch(receiveData(json))
        })
    }
}

// Reducers - specify how the application's state changes in response to actions sent to store
// All the application state is stored as a single object
// Design the shape of your application's state 
// We want to store - list of Bitcoin price data

// initial state
const initialState = {
  apiData: {}
}

const dataReducer = (state = initialState, action) => {
  switch(action.type) {
 
    case "RECEIVE_DATA":
    return Object.assign({}, state, {
            apiData: action.apiData,
            lastUpdated: action.receivedAt
        })
    default:
        return state
  }
}

// Store - An object that holds the complete state of your app.
// Pass two arguments to the reducer, current state tree and the action.
// Creates a Redux store that holds the complete state tree of your app.
const store = createStore(
    dataReducer,
    applyMiddleware(
        thunkMiddleware,
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
        const {dispatch} = this.props
        dispatch(getData())
    }
    
    render() {
        const {bpi, time} = this.props.apiData;
        return (
            <div>
                {this.props.apiData.bpi && 
                    <div>
                        <List data={bpi} update={time}/>
                    </div>
                }
            </div>
        )
    }
}

class List extends Component {
    render() {
        console.log(this.props)
        const date = Object.keys(this.props.data)
        const price = Object.values(this.props.data)

        return (
            <div>
                <p>Last Updated: {Object.values(this.props.update)[0]}</p>
                <p>Date</p>
                <ul>
                    {date.map((data, i) => {
                        return (
                            <li key = {i}>{data}</li>
                        )
                    })}
                </ul>
                <p>{price}</p>
            </div>
        )
    }
}

// tells how to transform the current Redux store state into the props you want to pass to a presentational component you are wrapping.
const mapStateToProps = (state) => ({
    apiData:state.apiData
});

// React Redux library's connect() function, which provides many useful optimizations to prevent unnecessary re-renders.
const ConnectedApp = connect(mapStateToProps)(App)

ReactDOM.render(
    <Provider store = {store}> 
        <ConnectedApp />
    </Provider>,
    document.getElementById('root')
);

registerServiceWorker();
