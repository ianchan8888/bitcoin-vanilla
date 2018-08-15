import { RECEIVE_REAL_TIME_PRICE_DATA } from "../Actions/realTimePriceDataActions"

const initialState = {
    priceData: { pair: "", volume: "", bid: [], ask: [], convertedTime: [] },
    realTimeGraphData: [],
    priceMovement: {askMovement: "", bidMovement: ""}
}

const getPriceMovement = (oldPrice, newPrice) => {
    if ((newPrice - oldPrice) > 0) {
        return 1
    } else if ((newPrice - oldPrice) < 0) {
        return -1
    } else {
        return 0
    }
}

export default function realTimePriceDataReducer(state = initialState, action) {
    switch (action.type) {
        case RECEIVE_REAL_TIME_PRICE_DATA:
            return {
                ...state,
                priceData: action.priceData,
                realTimeGraphData: state.realTimeGraphData.concat(action.realTimeGraphData),
                priceMovement: {
                    bidMovement: getPriceMovement(state.priceData.bid, action.priceData.bid),   
                    askMovement: getPriceMovement(state.priceData.ask, action.priceData.ask)
                }
            }
        default:
            return state
    }
}

