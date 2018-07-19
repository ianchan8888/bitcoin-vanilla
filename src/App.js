import React, { Component } from 'react';
import './App.css';
import {connect} from 'react-redux';

// import logo from './logo.svg';

const url = "https://www.quandl.com/api/v3/datasets/BCHARTS/"
const exchange = "BITSTAMP"
const currency = "USD"

// Actions are payloads of information that send data from your application to your store. 

// When an action creator returns a function, that function will get executed by the Redux Thunk middleware. 
// This function doesn't need to be pure; it is thus allowed to have side effects, including executing asynchronous API calls. 
// The function can also dispatch actions—like those synchronous actions we defined earlier.
// With asynchronous code, there is more state to take care of

const receiveData = (json) => {
  return {
    type: "RECEIVE_DATA",
    data: json.dataset,
    receivedAt: Date.now()
  }  
}

// Thunk action creator
const getData = () => {
    // It passes the dispatch method as an argument to the function,
    // thus making it able to dispatch actions itself.
    return (dispatch) => {
      return fetch(`${url}${exchange}${currency}`)
        .then(response => response.json())
        .then(json => {
          console.log(json.dataset)
          dispatch(receiveData(json))
        })
    }
}

// Reducers - specify how the application's state changes in response to actions sent to store
// All the application state is stored as a single object
// Design the shape of your application's state 
// We want to store - list of Bitcoin price data

// initial state
const initislState = {
  data: []
}

const data = (state = initialState, action) => {
  switch(action.type) {
    case "RECEIVE_DATA":
      return {
        ...state
      }
  }
}

// Store - An object that holds the complete state of your app
// Creates a Redux store that holds the complete state tree of your app.
const store = createStore(data)

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Bitcoin Price</h1>
        </header>
        <p className="App-intro">
         
        </p>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  
};

export default connect(mapStateToProps)(App);