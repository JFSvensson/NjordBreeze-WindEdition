import { initializeMap } from './mapSetup.js'
import { fetchData } from './fetchData.js'
import { updateMarkers } from './updateMarkers.js'
import { startUpdates, pauseUpdates, resetUpdates } from './controls.js'

document.addEventListener('DOMContentLoaded', async function() {
    const map = initializeMap()
    const datetimeDisplay = document.getElementById('datetime-display')
    let hoursPassed = 0
    let stations;

    async function performUpdates() {
        let timeToBegin = 1703725200000; // Start date
        hoursPassed = updateMarkers(map, stations, timeToBegin, hoursPassed, datetimeDisplay);
    }

    try {
        const data = await fetchData('https://svenssonom.se/njordbreeze-we/api/v1/smhi/all-wind-speed-data');
        if (data) {
            stations = Object.values(data)
                .filter(station => station.location && station.location.coordinates);
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }

    document.getElementById('start-button').addEventListener('click', () => startUpdates(performUpdates, 500))
    document.getElementById('pause-button').addEventListener('click', () => pauseUpdates())
    document.getElementById('reset-button').addEventListener('click', () => { 
        hoursPassed = 0 // Reset the hoursPassed
        resetUpdates()
    })
})
