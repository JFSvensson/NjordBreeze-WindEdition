import { getColorForWindSpeed } from './colorScale.js'

let markers = []  // Save markers in an array to be able to remove them later

export function updateMarkers(map, stations, timeToBegin, hoursPassed, displayElement) {
    let timestampIndex = timeToBegin + (3600000 * hoursPassed)
    displayElement.innerText = `${new Date(timestampIndex).toLocaleString()}`
    let timeSlider = document.getElementById('time-slider')
    if (hoursPassed % 24 === 0) {
        timeSlider.value = parseInt(timeSlider.value, 10) + 1
    }

    // Remove old markers
    markers.forEach(marker => {
        map.removeLayer(marker)
    })
    markers = [] // Clear the array

    stations.forEach(station => {
        if (station.date === timestampIndex) {
            const lat = station.location.coordinates[1]
            const lon = station.location.coordinates[0]
            const windSpeed = parseFloat(station.windSpeed)
            if (isNaN(windSpeed) || windSpeed === 0) {
                return
            }
            const windDirection = station.windDirection
            const color = getColorForWindSpeed(windSpeed)  // Get color based on wind speed

            const directionMarker = L.marker([lat, lon], {
                icon: L.divIcon({
                    className: 'wind-direction-arrow',
                    html: `<div style='transform: rotate(${windDirection}deg); color: ${color}; transform-origin: 25% 50%;'>➤</div>`,
                    iconSize: [30, 30],
                    iconAnchor: [15, 15]
                })
            }).addTo(map)

            // const speedMarker = L.marker([lat, lon], {
            //     icon: L.divIcon({
            //         className: 'wind-speed-marker',
            //         html: `<span>${windSpeed.toFixed(1)}</span>`,
            //         iconSize: [30, 30]
            //     })
            // }).addTo(map)

            // markers.push(speedMarker)
            markers.push(directionMarker)
        }
    })

    return hoursPassed + 1
}
