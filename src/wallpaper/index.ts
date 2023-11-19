import { ref, watch } from 'vue'
import { Get } from '../api/request'
import { fetchBing } from './bing'

interface wallaper {
  title: string
  url: string
}

const storage = chrome.storage

export function useWallpaper() {
  const sourceOptions = ['bing', 'dribbble', 'pixabay', 'pexels', 'unsplash']
  const source = ref(0)
  const wallpapers = ref([])
  const current = ref(0)
  const currentWallpaper = ref<wallaper>()

  const fetchWallpaper = async () => {
    if (process.env.NODE_ENV === 'development') return
    const wallpaperData = (await storage.sync.get('wallpaperData'))['wallpaperData']
    if (wallpaperData) {
      source.value = wallpaperData.source
      current.value = wallpaperData.current
      currentWallpaper.value = wallpaperData.currentWallpaper
    }
    if (source.value == 0) wallpapers.value = await fetchBing()
    if (!wallpaperData) {
      currentWallpaper.value = wallpapers.value[0]
      storage.sync.set({
        wallpaperData: {
          source: source.value,
          current: current.value,
          currentWallpaper: currentWallpaper.value
        }
      })
    }
  }

  const changWallpaper = () => {
    if (wallpapers.value) {
      current.value = (current.value + 1) % wallpapers.value.length
      currentWallpaper.value = wallpapers.value[current.value]
      storage.sync.set({
        wallpaperData: {
          source: source.value,
          current: current.value,
          currentWallpaper: currentWallpaper.value
        }
      })
    }
  }

  fetchWallpaper()

  return { source, wallpapers, currentWallpaper, changWallpaper }
}
