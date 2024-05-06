let markers = []  // Save markers in an array to be able to remove them later

export function updateMarkers(map, stations, timeToBegin, hoursPassed, displayElement) {
    let timestampIndex = timeToBegin + (3600000 * hoursPassed)
    displayElement.innerText = `Data displayed for: ${new Date(timestampIndex).toLocaleString()}`

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
            if (isNaN(windSpeed)) {
                return
            }
            const windDirection = station.windDirection
            const color = getColorForWindSpeed(windSpeed)  // Get color based on wind speed

            const speedMarker = L.marker([lat, lon], {
                icon: L.divIcon({
                    className: 'wind-speed-marker',
                    html: `<span>${windSpeed.toFixed(1)}</span>`,
                    iconSize: [30, 30]
                })
            }).addTo(map)

            const directionMarker = L.marker([lat, lon], {
                icon: L.divIcon({
                    className: 'wind-direction-arrow',
                    html: `<div style='transform: rotate(${windDirection}deg); color: ${color}; transform-origin: center;'>➤</div>`,
                    iconSize: [30, 30],
                    iconAnchor: [15, 15]
                })
            }).addTo(map)

            markers.push(speedMarker)
            markers.push(directionMarker)
        }
    })

    return hoursPassed + 1
}

function getColorForWindSpeed(windSpeed) {
    if (windSpeed < 5) {
        return '#00bfff'; // Ljusblå för svaga vindar
    } else if (windSpeed < 15) {
        return '#007fff'; // Mörkblå för måttliga vindar
    } else if (windSpeed < 25) {
        return '#ffbf00'; // Gul för starka vindar
    } else {
        return '#ff0000'; // Röd för mycket starka vindar
    }
}

