import {
    GET_HISTORICAL_PRICES,
    RECEIVE_HISTORICAL_PRICES,
    RECEIVE_HISTORICAL_PRICES_ERROR
} from "../Actions/historicalPricesActions"

const initialState = {
    loading: true,
    error: false,
    prices: { values: [], dates: [] },
    graphData: [],
    updateTime: ''
}

const historicalPricesReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_HISTORICAL_PRICES:
            return {
                ...state,
                loading: true
            }
        case RECEIVE_HISTORICAL_PRICES:
            return {
                ...state,
                loading: false,
                prices: action.prices,
                graphData: action.graphData,
                updateTime: action.updateTime
            }
        case RECEIVE_HISTORICAL_PRICES_ERROR:
            return {
                ...state,
                loading: false,
                error: true
            }
        default:
            return state
    }
}

export default historicalPricesReducer
