// import React from 'react';
// import ReactDOM from 'react-dom';
import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import fetchMock from 'fetch-mock'
import {dataReducer, getData} from './index.js'

// import {sum} from './sum.js';
// import App from './App';

// it('sums numbers', () => {
//   expect(sum(1, 2)).toEqual(3);
//   expect(sum(2, 2)).toEqual(4);
// });

// it('renders without crashing', () => {
//   const div = document.createElement('div');
//   ReactDOM.render(<App />, div);
//   ReactDOM.unmountComponentAtNode(div);
// });

// model the async flow of beginning and end resulting in success or an error with three actions.
// mocking the redux-store
// it does not update the Redux store. 

const middlewares = [thunk]
const mockStore = configureStore(middlewares)

// creates a block that groups together several related tests in one "test suite". 
describe("async action", () => {
  afterEach(() => {
    fetchMock.reset()
    fetchMock.restore()
  })

  test("calls request and success actions if the fetch response was successful", () => {
    expect.assertions(1);
     fetchMock
      .getOnce("https://api.coindesk.com/v1/bpi/historical/close.json",{ bpi: {"2018-06-24":12345}})

    const expectedActions = [
      { type: "REQUEST_DATA" },
      { type: "RECEIVE_DATA", apiData: { bpi: {"2018-06-24":12345}}, receivedAt: Date() }
    ]

    const store = mockStore({})
    return store.dispatch(getData())
      .then(() => {
        const storeActions = store.getActions();
        expect(storeActions).toEqual(expectedActions);
    })
  })
})

describe("async action error", () => {
  afterEach(() => {
    fetchMock.reset()
    fetchMock.restore()
  })

  test("calls request and failure actions if the fetch response was not successful", () => {
    expect.assertions(1);
     fetchMock
      .getOnce("https://error.coindesk.com/v1/bpi/historical/close.json",{ error: "error"})

    const expectedActions = [
      { type: "REQUEST_DATA" },
      { type: "RECEIVE_ERROR", error: "error"}
    ]

    const store = mockStore({})
    return store.dispatch(getData())
      .then(() => {
        const storeActions = store.getActions();
        expect(storeActions).toEqual(expectedActions);
    })
  })
})