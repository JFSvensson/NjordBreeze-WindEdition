fetch('https://svenssonom.se/njordbreeze-we/api/v1/smhi/stations-with-moderate-wind-speed')
  .then(response => response.json())
  .then(data => {
    console.log(data)
    const dataArray = Object.values(data)
    const ctx = document.getElementById('myChart').getContext('2d')
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: dataArray.map(station => station.stationname),
        datasets: [{
          label: 'Wind Speed',
          data: dataArray.map(station => station.windSpeed),
          fill: false,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        }]
      }
    })
  })