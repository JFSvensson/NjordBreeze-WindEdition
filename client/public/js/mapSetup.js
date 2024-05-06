export function initializeMap() {
  const map = L.map('map').setView([62.0, 15.0], 5) // Center of Sweden
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map)
  return map
}
