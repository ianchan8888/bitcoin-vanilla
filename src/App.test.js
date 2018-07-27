// import React from 'react';
// import ReactDOM from 'react-dom';
import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import {getData, dataReducer} from './index.js'

// model the async flow of beginning and end resulting in success or an error with three actions.
// mocking the redux-store
// it does not update the Redux store. 

const middlewares = [thunk]
const mockStore = configureStore(middlewares)

// creates a block that groups together several related tests in one "test suite". 
describe("async action", () => {
  // Dependency injection is about removing the hard coded dependencies and providing 
  // way of changing dependencies in compile-time or run-time.
  const api = {
    fetchApiData: jest.fn(() => {
      return new Promise((resolve, reject) => { 
        resolve({
          data: "value"
        })
      })
    })
  }
  const dispatch = jest.fn()
  const url = `https://api.coindesk.com/v1/bpi/historical/close.json`

  test("should call with correct args", () => {
    getData(url)(dispatch,null,{api})
    expect(api.fetchApiData).toHaveBeenCalledWith(url)
    expect(dispatch).toHaveBeenCalledWith({
      type:"REQUEST_DATA",
    })
  })

  test("success- should receive data", () => {
    getData(url)(dispatch,null,{api})
    expect(api.fetchApiData()).resolves.toEqual({data:"value"})
  })
})

// Reducer Test
describe(" dataReducer", () => {
  test("should return the initial state", () => {
    expect(dataReducer(undefined, {})).toEqual({
      isFetching: false,
      apiData: {},
      error: "",
      lastUpdated: ""
    })
  })

  test("should handle REQUEST_DATA", () => {
    const startAction = {
      type: "REQUEST_DATA",
      isFetching: true,
    }
    expect(dataReducer({}, startAction)).toEqual({
      isFetching: true,
    })
  })

  test("should handle REQUEST_DATA", () => {
    const successAction = {
      type: "RECEIVE_DATA",
      isFetching: false,
      apiData: "json",
      receivedAt: Date()
    }
    expect(dataReducer({}, successAction)).toEqual({
      isFetching: false,
      apiData: "json",
      lastUpdated: Date()
    })
  })

  test("should handle RECEIVE_ERROR", () => {
    const errorAction = {
      isFetching: false,
      type: "RECEIVE_ERROR",
      error: "error"
    }
    expect(dataReducer({}, errorAction)).toEqual({
      isFetching: false,
      error:"error"
    })
  })
})