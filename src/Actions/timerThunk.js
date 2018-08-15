import { startTimer, tick } from "./timerActions"

export default function controlTimer () {
    return (dispatch) => {
        dispatch(startTimer())
        setInterval(() => dispatch(tick(Date()), 1000))
    }
}