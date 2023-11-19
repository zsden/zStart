import { onMounted, ref } from 'vue'
import { domainHasIcon } from '@/components/fontawesome-icons'

type FavoriteUrl = {
  icon?: string
} & chrome.history.HistoryItem

const storage = chrome.storage

function FavoriteUrlsUnique(favoriteUrls: FavoriteUrl[]) {
  const domains = favoriteUrls.map((item) => (item.url || '').split('/')[2])
  const uniqueDomains = [...new Set(domains)]
  const uniqueFavoriteUrls: FavoriteUrl[] = []
  for (const domain of uniqueDomains) {
    uniqueFavoriteUrls.push(
      favoriteUrls.filter((item) => domain === (item.url || '').split('/')[2])[0]
    )
  }
  return uniqueFavoriteUrls.sort((a, b) => Number(b.visitCount) - Number(a.visitCount))
}

// 快速访问
export function useFavoriteUrls() {
  const currentFavoriteUrls = ref<FavoriteUrl[]>()
  onMounted(() => {
    if (process.env.NODE_ENV === 'development') return
    chrome.history.search(
      {
        text: ''
      },
      async (history) => {
        let newFavoriteUrls = history.filter((item) => Number(item.visitCount) > 3)

        const savedFavoriteUrls: FavoriteUrl[] = (await storage.sync.get('favoriteUrls'))[
          'favoriteUrls'
        ]

        console.log('savedFavoriteUrls', savedFavoriteUrls)

        if (savedFavoriteUrls) {
          if (savedFavoriteUrls.length >= 18) {
            currentFavoriteUrls.value = savedFavoriteUrls.map((item) => {
              item.icon = domainHasIcon(item.url)
              return item
            })
            return
          }
          newFavoriteUrls = savedFavoriteUrls.concat(
            FavoriteUrlsUnique(newFavoriteUrls).slice(0, 18 - savedFavoriteUrls.length)
          ) // 已保存很多喜好链接时，仅补充空余位置
        }

        let uniqueFavoriteUrls: FavoriteUrl[] = FavoriteUrlsUnique(newFavoriteUrls)

        uniqueFavoriteUrls = uniqueFavoriteUrls
        .slice(0, 18) // 至多显示18个

        // console.log(uniqueFavoriteUrls);

        storage.sync.set({ favoriteUrls: uniqueFavoriteUrls })

        currentFavoriteUrls.value = uniqueFavoriteUrls.map((item) => {
          item.icon = domainHasIcon(item.url)
          return item
        })
      }
    )
  })

  return { currentFavoriteUrls }
}

// todo
// 删除链接
