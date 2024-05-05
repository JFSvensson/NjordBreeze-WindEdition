fetch('https://svenssonom.se/njordbreeze-we/api/v1/smhi/stations-with-moderate-wind-speed')
  .then(response => response.json())
  .then(data => {
    const dataArray = Object.values(data);

    var mymap = L.map('mapid').setView([dataArray[0].location.coordinates[1], dataArray[0].location.coordinates[0]], 5);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
    }).addTo(mymap);

    dataArray.forEach(station => {
      if (station.location && station.location.coordinates) {
          L.marker([station.location.coordinates[1], station.location.coordinates[0]]).addTo(mymap)
              .bindPopup(`<b>${station.stationname}</b><br>Wind Speed: ${station.windSpeed}`);
      }
    });
  });
