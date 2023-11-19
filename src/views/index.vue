<script setup lang="ts">
import { onMounted } from 'vue'
import { useWallpaper } from '@/wallpaper/index'
import { useFavoriteUrls } from '@/hook/FavoriteUrl'
import autofit from 'autofit.js'
import WeatherTime from '@/components/WeatherTime/index.vue'

onMounted(() => {
  autofit.init({
    dh: 1440,
    dw: 2560,
    el: '#app',
    resize: true
  })
})

const { currentFavoriteUrls } = useFavoriteUrls()
const { currentWallpaper, changWallpaper } = useWallpaper()

// const extractColorByName = computed(() => {
//   return (name: string = '') => {
//     let temp = []
//     temp.push('#')
//     for (const str of name) {
//       temp.push(str.charCodeAt(0).toString(16))
//     }
//     return temp.slice(0, 5).join('').slice(0, 4)
//   }
// })
</script>

<template>
  <div id="body-box" class="body-box">
    <div class="bg">
      <div class="cover"></div>
      <img :src="currentWallpaper?.url" :alt="changWallpaper?.name" srcset="" />
    </div>
    <div class="container">
      <weather-time class="time-el" />
      <div class="favorite-url">
        <a :href="item.url" v-for="(item, index) in currentFavoriteUrls" :key="index">
          <div class="url-item">
            <el-icon size="4rem">
              <font-awesome-icon v-if="item.icon" :icon="['fab', item.icon]" inverse />
              <i-ep-link v-else />
            </el-icon>
            <div class="url-item-title">{{ item.title }}</div>
          </div>
        </a>
      </div>
    </div>
    <div class="change-wallpaper" @click="changWallpaper">
      <el-icon size="1.5rem">
        <i-ep-refresh />
      </el-icon>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.body-box {
  width: 100%;
  height: 100%;
  position: relative;
}

.container {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;

  .cover {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
    background-image: radial-gradient(rgba(0, 0, 0, 0) 0, rgba(0, 0, 0, 0.5) 100%),
      radial-gradient(rgba(0, 0, 0, 0) 33%, rgba(0, 0, 0, 0.3) 166%);
    transition: 0.25s;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.time-el {
  margin-top: 13rem;
}

.favorite-url {
  margin-top: 6rem;
  width: 96rem;
  display: flex;
  flex-wrap: wrap;

  a {
    margin: 1rem;
    position: relative;
    color: rgba(255, 255, 255, 0.75);

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
      background-color: rgba(255, 255, 255, 0.25);
      backdrop-filter: blur(0.6rem);
      box-shadow: rgba(142, 142, 142, 0.19) 0rem 0.6rem 1.5rem 0rem;
      border-radius: 1.2rem;
    }

    &:hover::before {
      background-color: rgba(255, 255, 255, 0.45);
      box-shadow: rgba(142, 142, 142, 0.19) 0rem 0.6rem 1.5rem 0rem;
    }
  }

  .url-item {
    width: 14rem;
    padding: 1.5rem 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    .url-item-title {
      width: 100%;
      font-size: 1.4rem;
      color: #fff;
      font-weight: 900;
      font-family: '微软雅黑';
      cursor: pointer;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
      text-align: center;
      margin-top: 1rem;
    }
  }
}

.change-wallpaper {
  position: absolute;
  right: 1rem;
  bottom: 1rem;
  color: rgba($color: #fff, $alpha: 0.8);
  z-index: 1;
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
    background-color: rgba(255, 255, 255, 0.25);
    backdrop-filter: blur(0.6rem);
    box-shadow: rgba(142, 142, 142, 0.19) 0rem 0.6rem 1.5rem 0rem;
    border-radius: 50%;
  }

  &:hover::before {
    background-color: rgba(255, 255, 255, 0.45);
    box-shadow: rgba(142, 142, 142, 0.19) 0rem 0.6rem 1.5rem 0rem;
  }

  &:hover{
    transform: rotate(180deg);
  }
}
</style>
