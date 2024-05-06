export function updateMarkers(map, stations, timeToBegin, hoursPassed, displayElement) {
    let timestampIndex = timeToBegin + (3600000 * hoursPassed)
    displayElement.innerText = `Data displayed for: ${new Date(timestampIndex).toLocaleString()}`

    map.eachLayer(layer => {
        if (layer instanceof L.Marker) {
            map.removeLayer(layer)
        }
    })

    stations.forEach(station => {
        if (station.date === timestampIndex) {
            const lat = station.location.coordinates[1]
            const lon = station.location.coordinates[0]
            const windSpeed = parseFloat(station.windSpeed)
            const windDirection = station.windDirection

            L.marker([lat, lon], {
                icon: L.divIcon({
                    className: 'wind-speed-marker',
                    html: `<span>${windSpeed.toFixed(1)}</span>`,
                    iconSize: [30, 30]
                })
            }).addTo(map)

            L.marker([lat, lon], {
                icon: L.divIcon({
                    className: 'wind-direction-arrow',
                    html: `<div style='transform: rotate(${windDirection}deg); transform-origin: center;'>➤</div>`,
                    iconSize: [30, 30],
                    iconAnchor: [15, 15]
                })
            }).addTo(map)
        }
    })

    return hoursPassed + 1
}
