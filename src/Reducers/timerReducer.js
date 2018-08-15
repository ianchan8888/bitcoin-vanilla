import { START_TIMER, TICK } from "../Actions/timerActions"

const initialState = {
    started: false,
    time: ""
}

export default function timerReducer(state = initialState, action)  {
    switch (action.type) {
        case START_TIMER:
            return {
                ...state,
                started: true
            }
        case TICK:
            return {
                ...state,
                time: action.time
            } 
        default:
            return state
    }
}