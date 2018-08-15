import thunkMiddleware from "redux-thunk"
import connectWebSocketMiddleware from "../Actions/websocketMiddleware"
import { createStore, applyMiddleware, compose } from "redux"
import rootReducer from "../Reducers"

export default function configureStore(config) {
    const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose // chrome redux dev tools

    const api = {
        getHistoricalPrices: window.fetch(config.historyURL)
    }

    return createStore(
        rootReducer,
         /* preloadedState, */ composeEnhancers(
            applyMiddleware(
                thunkMiddleware.withExtraArgument(api), // They would receive dispatch as an argument and may call it asynchronously. 
                connectWebSocketMiddleware(config.wsUrl, config.channel)
            )
        )
    )
}

