export function displayColorScale() {
  const scaleContainer = document.getElementById('color-scale-container')
  let innerHTML = ''
  for (let i = 0; i <= 33; i++) {
      const color = getColorForWindSpeed(i)
      innerHTML += `<span style='background-color: ${color}; height: 100%; width: ${ 100 / 34 }%; display: inline-block;'></span>`
  }
  scaleContainer.innerHTML = innerHTML
}

export function getColorForWindSpeed(windSpeed) {
  // Normalise the wind speed to a value between 0 and 1
  const normalizedSpeed = Math.min(windSpeed / 33, 1) // Maximum is 33 m/s (Orkan)

  let lightness = 70 - (normalizedSpeed * 70) // Start at 70%, going to 0%
  let saturation = 100
  let hue = 0

  return `hsl(${hue}, ${saturation}%, ${lightness}%)`
}
