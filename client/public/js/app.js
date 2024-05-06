document.addEventListener('DOMContentLoaded', function() {
    const map = L.map('map').setView([62.0, 15.0], 5) // Center of Sweden
    let date = new Date()
    date.setMonth(date.getMonth() - 1)
    let timestampIndex = date.getTime()
    let stations = []
  
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map)
  
    fetch('https://svenssonom.se/njordbreeze-we/api/v1/smhi/all-wind-speed-data')
      .then(response => response.json())
      .then(data => {
        stations = Object.values(data)
          .filter(station => station.location && station.location.coordinates)
        updateMarkers()
        setInterval(updateMarkers, 5000) // Update every 5 seconds
      })

      function updateMarkers() {
        map.eachLayer(layer => {
            if (layer instanceof L.Marker) {
                map.removeLayer(layer)
            }
        })

        stations.forEach(station => {
            const lat = station.location.coordinates[1]
            const lon = station.location.coordinates[0]
            const windData = station.windData.find(item => item.date === timestampIndex)
            if (!windData) {
            return
            }
            const intensity = parseFloat(windData.windSpeed)
            const direction = windData.windDirection

            // Check if intensity is NaN
            if (isNaN(intensity)) {
                return null
            }

            // Add a marker for the wind speed
            L.marker([lat, lon], {
                icon: L.divIcon({
                    className: 'wind-speed-marker',
                    html: intensity.toFixed(1),
                    iconSize: [30, 30]
                })
            }).addTo(map)

            // Add a marker for the wind direction
            L.marker([lat, lon], {
                icon: L.divIcon({
                    className: 'wind-direction-arrow',
                    html: `<div style='transform: rotate(${direction}deg); transform-origin: center;'>➤</div>`,
                    iconSize: [30, 30],
                    iconAnchor: [15, 15]
                })
            }).addTo(map)
        }).filter(station => station !== null) // Filter out stations with a windSpeed of NaN

        timestampIndex += 86400000 // Add one day
    }
  
    // L.heatLayer(points, {
    //     radius: 50,
    //     blur: 30,
    //     maxZoom: 15,
    //     max: 33,
    // }).addTo(map)
})
