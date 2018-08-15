import React from "react"
import ReactDOM from "react-dom"
import { Provider } from "react-redux"
import registerServiceWorker from "./registerServiceWorker"
import App from "./Containers/App"
import configureStore from "./Store"
import "./index.css" 
import "./textStyle.css"
import "./containerStyle.css"
import "./colourStyle.css"
import "./graphStyle.css"
import "./tableStyle.css"
import "./buttonStyle.css"
import getHistoricalPricesThunk from "./Actions/historicalPricesThunk"
import { websocketConnect } from "./Actions/websocketActions"

const config = {
    historyURL: "https://api.coindesk.com/v1/bpi/historical/close.json",
    wsUrl: "ws://localhost:4000",
    channel: "ticker"
}

const store = configureStore(config)

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root')
)

store.dispatch(getHistoricalPricesThunk())
store.dispatch(websocketConnect())

registerServiceWorker()
