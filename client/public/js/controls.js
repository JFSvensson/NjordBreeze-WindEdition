let intervalId

export function startUpdates(updateFunction, interval) {
    intervalId = setInterval(updateFunction, interval)
}

export function pauseUpdates() {
    clearInterval(intervalId)
}

export function resumeUpdates(updateFunction, interval) {
    startUpdates(updateFunction, interval)
}
