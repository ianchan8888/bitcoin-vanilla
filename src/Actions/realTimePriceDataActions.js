export const RECEIVE_REAL_TIME_PRICE_DATA = "RECEIVE_REAL_TIME_PRICE_DATA"

export const receiveRealTimePriceData = (priceData, realTimeGraphData) => ({
    type: RECEIVE_REAL_TIME_PRICE_DATA,
    priceData,
    realTimeGraphData
})