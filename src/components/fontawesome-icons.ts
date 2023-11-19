import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
// import { far } from '@fortawesome/free-regular-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'

// library.add(fas, far, fab)
library.add(fas, fab)

const brandOriKeys = Object.keys(fab)
const brandKeys = Object.keys(fab).map((brand) => brand.slice(2, brand.length).toLowerCase())

export function domainHasIcon(url?: string) {
  if (!url) return ''
  let iconName = ''
  if (url.includes('douyin.com')) return 'tiktok'
  for (const [index, brand] of brandKeys.entries()) {
    if (url.includes(brand + '.')) iconName = fab[brandOriKeys[index]].iconName
  }
  return iconName
}

export default FontAwesomeIcon