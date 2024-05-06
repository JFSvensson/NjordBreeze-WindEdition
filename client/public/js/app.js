document.addEventListener('DOMContentLoaded', function() {
    const map = L.map('map').setView([62.0, 15.0], 5) // Center of Sweden
    let hoursPassed = 0

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map)
  
    async function fetchData() {
        try {
            const response = await fetch('https://svenssonom.se/njordbreeze-we/api/v1/smhi/all-wind-speed-data')
            const data = await response.json()
            const stations = Object.values(data)
                .filter(station => station.location && station.location.coordinates)
            let timeToBegin = 1703725200000 // 2024-01-01
            setInterval(() => {
                updateMarkers(stations, timeToBegin)
            }, 500)
        } catch (error) {
            console.error('Error:', error)
        }
    }

    fetchData()

    function updateMarkers(stations, timeToBegin) {
        let timestampIndex = timeToBegin + ( 3600000 * hoursPassed )

        if (!stations || !Array.isArray(stations)) {
            return
        }

        map.eachLayer(layer => {
            if (layer instanceof L.Marker) {
                map.removeLayer(layer)
            }
        })

        stations.filter(station => station.windSpeed !== "0.0") // Filtrera bort stationer med 0 i vindhastighet
           .forEach(station => {
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
                    }).addTo(map);

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

        hoursPassed++ // Add one hour
    }
})
