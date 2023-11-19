import { ref } from 'vue'
import { Get } from '../api/request'

export const fetchBing = async (idx: number = 0) => {
  const response = await Get('https://cn.bing.com/HPImageArchive.aspx', {
    format: 'js',
    idx,
    n: 8,
    mkt: 'zh-CN'
  })
  const wallpapers = response.images.map((item: { url: string }) => {
    item.url = item.url.replace('1920x1080', 'UHD')
    item.url = 'https://cn.bing.com' + item.url
    return item
  })
  // console.log('wallpapers', wallpapers)
  return wallpapers
}
