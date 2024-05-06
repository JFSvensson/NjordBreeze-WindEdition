import { initializeMap } from './mapSetup.js'
import { fetchData } from './fetchData.js'
import { updateMarkers } from './updateMarkers.js'
import { startUpdates, pauseUpdates, resumeUpdates } from './controls.js'

document.addEventListener('DOMContentLoaded', function() {
    const map = initializeMap()
    const datetimeDisplay = document.getElementById('datetime-display')
    let hoursPassed = 0

    async function performUpdates() {
        const data = await fetchData('https://svenssonom.se/njordbreeze-we/api/v1/smhi/all-wind-speed-data')
        if (data) {
            const stations = Object.values(data)
                .filter(station => station.location && station.location.coordinates)
            let timeToBegin = 1703725200000 // Start date
            hoursPassed = updateMarkers(map, stations, timeToBegin, hoursPassed, datetimeDisplay)
        }
    }

    document.getElementById('start-button').addEventListener('click', () => startUpdates(performUpdates, 500))
    document.getElementById('pause-button').addEventListener('click', pauseUpdates)
    document.getElementById('resume-button').addEventListener('click', () => resumeUpdates(performUpdates, 500))
})
