// Actions for getting history prices

export const GET_HISTORICAL_PRICES = "GET_HISTORICAL_PRICES"
export const RECEIVE_HISTORICAL_PRICES = "RECEIVE_HISTORICAL_PRICES"
export const RECEIVE_HISTORICAL_PRICES_ERROR = "RECEIVE_HISTORICAL_PRICES_ERROR"

export const getHistoricalPrices = () => ({
    type: GET_HISTORICAL_PRICES
})

export const receiveHistoricalPrices = (prices, graphData, updateTime) => ({
    type: RECEIVE_HISTORICAL_PRICES,
    prices,
    graphData,
    updateTime 
})

export const receiveHistoricalPricesError = (error) => ({
    type: RECEIVE_HISTORICAL_PRICES_ERROR,
    error
})


