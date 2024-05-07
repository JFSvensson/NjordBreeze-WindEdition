export async function fetchData(url) {
  const timeSlider = document.getElementById('time-slider')
  const loadingBar = document.getElementById('loading-bar')

  try {
    loadingBar.style.display = 'flex'
    timeSlider.disabled = true

    const response = await fetch(url)
    const data = await response.json()

    return data
  } catch (error) {
    console.error('Error fetching data:', error)
  } finally {
    loadingBar.style.display = 'none'
    timeSlider.disabled = false
  }
}
