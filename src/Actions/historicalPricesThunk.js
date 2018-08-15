// Thunk action creator for fetching historial prices

import {
    getHistoricalPrices,
    receiveHistoricalPrices,
    receiveHistoricalPricesError
} from "./historicalPricesActions"

export default function getHistoricalPricesThunk() {
    // It passes the dispatch method as an argument to the function,
    // thus making it able to dispatch actions itself.
    return (dispatch, _, api) => {

        dispatch(getHistoricalPrices())

        return api.getHistoricalPrices
            .then((response) => {
                return response.json()
            })
            .then(({ bpi, time }) => {
                console.debug(`@getHistoricalPrices parsed json`, { bpi, time })
                const prices = {
                    values: Object.values(bpi),
                    dates: Object.keys(bpi)
                }

                const graphData = Object.keys(bpi).map((key, i) => {
                    const value = Object.values(bpi)[i]
                    return { date: key, value }
                })
                dispatch(receiveHistoricalPrices(prices, graphData, time.updated))
            })
            .catch((error) => {
                console.error(`@getHistoricalPrices error`, error)
                dispatch(receiveHistoricalPricesError(error))
            })
    }
}


