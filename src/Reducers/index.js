import { combineReducers } from "redux"
import historicalPricesReducer from "./historicalPricesReducer"
import websocketReducer from "./websocketReducer"
import realTimePriceDataReducer from "./realTimePriceDataReducer"
import timerReducer from "./timerReducer"

const rootReducer = combineReducers({
    historicalPrices: historicalPricesReducer,
    websocket: websocketReducer,
    realTimePriceData: realTimePriceDataReducer,
    timer: timerReducer
})

export default rootReducer