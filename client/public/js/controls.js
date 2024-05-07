const startButton = document.getElementById('start-button')
const pauseButton = document.getElementById('pause-button')
const resetButton = document.getElementById('reset-button')
const datetimeDisplay = document.getElementById('datetime-display')

let intervalId

export function startUpdates(updateFunction, interval) {
    if (intervalId) {
        clearInterval(intervalId)
    }
    intervalId = setInterval(updateFunction, interval)
    startButton.textContent = 'Körs...'
    startButton.disabled = true
    pauseButton.disabled = false
    pauseButton.textContent = 'Paus'
    resetButton.disabled = false
}

export function pauseUpdates() {
    clearInterval(intervalId)
    pauseButton.disabled = true
    pauseButton.textContent = 'Pausad'
    startButton.disabled = false
    startButton.textContent = 'Återuppta'
}

export function resetUpdates() {
    pauseUpdates()
    startButton.disabled = false
    startButton.textContent = 'Start'
    pauseButton.disabled = true
    pauseButton.textContent = 'Pausad'
    resetButton.disabled = true
    datetimeDisplay.innerText = `${new Date(1703725200000).toLocaleString()}`
}
