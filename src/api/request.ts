import axios from 'axios'

const instance = axios.create({
  baseURL: 'https://api.example.com' // 替换为你的 API 基础 URL
})

instance.interceptors.request.use((config) => {
  // 在发送请求之前做些什么，例如添加 token 到请求头
  // config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`
  return config
})

instance.interceptors.response.use((response) => {
  // 如果响应状态码不是 2xx，抛出错误
  if (response.status !== 200) {
    throw new Error(`请求失败: ${response.status}`)
  }
  return response.data
})

export function Get(url: string, params?: any): Promise<any> {
  return instance
    .get(url, { params })
    
}

export function Post(url: string, params?: any): Promise<any> {
  return instance.post(url, params)
}