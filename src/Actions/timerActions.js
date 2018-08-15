export const START_TIMER = "START_TIMER"
export const TICK = "TICK"

export const startTimer = () => ({
    type: START_TIMER
})

export const tick = (time) => ({
    type: TICK,
    time
})