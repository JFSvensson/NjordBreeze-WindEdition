export async function fetchData(url) {
  try {
    document.getElementById('loading-bar').style.display = 'flex'

    const response = await fetch(url)
    const data = await response.json()

    document.getElementById('loading-bar').style.display = 'none'

    return data
  } catch (error) {
    console.error('Error fetching data:', error)
  }
}
