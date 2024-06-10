import { onMounted, ref } from 'vue'
import { domainHasIcon } from '@/components/fontawesome-icons'

type FavoriteLink = {
  icon?: string
} & chrome.history.HistoryItem

const storage = chrome.storage

function FavoriteLinksUnique(favoriteLinks: FavoriteLink[]) {
  const domains = favoriteLinks.map((item) => (item.url || '').split('/')[2])
  const uniqueDomains = [...new Set(domains)]
  const uniqueFavoriteLinks: FavoriteLink[] = []
  for (const domain of uniqueDomains) {
    uniqueFavoriteLinks.push(
      favoriteLinks.filter((item) => domain === (item.url || '').split('/')[2])[0]
    )
  }
  return uniqueFavoriteLinks.sort((a, b) => Number(b.visitCount) - Number(a.visitCount))
}

// 快速访问
export function useFavoriteLinks() {
  const currentFavoriteLinks = ref<FavoriteLink[]>()
  const uniqueFavoriteLinks = ref<FavoriteLink[]>()
  onMounted(() => {
    if (process.env.NODE_ENV === 'development') return
    chrome.history.search(
      {
        text: ''
      },
      async (history) => {
        const historyFavoriteLinks: FavoriteLink[] = history.filter(
          (item) => Number(item.visitCount) > 3
        ) // 取出历史中访问数大于3的链接
        uniqueFavoriteLinks.value = FavoriteLinksUnique(historyFavoriteLinks) // 去重

        const savedFavoriteLinks: FavoriteLink[] = (await storage.sync.get('favoriteLinks'))[
          'favoriteLinks'
        ]

        // console.log('savedFavoriteLinks', savedFavoriteLinks)

        if (savedFavoriteLinks) {
          currentFavoriteLinks.value = savedFavoriteLinks.map((item) => {
            item.icon = domainHasIcon(item.url)
            return item
          })
        } else {
          // 第一次 至多显示18个
          const newFavoriteLinks = uniqueFavoriteLinks.value.slice(0, 18)
          storage.sync.set({ favoriteLinks: newFavoriteLinks })
          currentFavoriteLinks.value = newFavoriteLinks.map((item) => {
            item.icon = domainHasIcon(item.url)
            return item
          })
        }

        // console.log('uniqueFavoriteLinks', uniqueFavoriteLinks.value)
      }
    )
  })

  const delIndex = ref(-1)

  const delFavoriteLink = (index: number) => {
    if (currentFavoriteLinks.value) {
      const link = currentFavoriteLinks.value[index]
      if (link) {
        currentFavoriteLinks.value.splice(index, 1)
        storage.sync.set({ favoriteLinks: FavoriteLinksUnique(currentFavoriteLinks.value) })
      }
    }
    delIndex.value = -1
  }

  return { currentFavoriteLinks, uniqueFavoriteLinks, delFavoriteLink, delIndex }
}

// todo
// 删除链接
