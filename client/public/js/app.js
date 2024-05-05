document.addEventListener('DOMContentLoaded', function() {
    const map = L.map('map').setView([62.0, 15.0], 5) // Center of Sweden
  
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map)
  
    fetch('https://svenssonom.se/njordbreeze-we/api/v1/smhi/all-wind-speed-data') // Adjust the URL to your API
      .then(response => response.json())
      .then(data => {
        const points = Object.values(data)
          .filter(station => station.location && station.location.coordinates)
          .map(station => {
            const lat = station.location.coordinates[1]
            const lon = station.location.coordinates[0]
            const intensity = parseFloat(station.windSpeed)
  
          // Add a marker for the station
          L.marker([lat, lon], {
            icon: L.divIcon({
              className: 'wind-speed-marker',
              html: intensity.toFixed(1), // Display the wind speed as the marker
              iconSize: [30, 30] // Adjust the size of the marker
            })
          }).addTo(map)
  
            return [lat, lon, intensity]
          })
  
        L.heatLayer(points, {
            radius: 50,
            blur: 30,
            maxZoom: 15,
            max: 33,
        }).addTo(map)
      })
      .catch(error => console.error('Error loading the data:', error))
  })
