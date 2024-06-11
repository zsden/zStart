<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useWallpaper } from '@/wallpaper/index'
import { useFavoriteLinks } from '@/hook/FavoriteLink'
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

const {
  currentFavoriteLinks,
  uniqueFavoriteLinks,
  delIndex,
  delFavoriteLink,
  addLinkDrawer,
  addFavoriteLink
} = useFavoriteLinks()
const { currentWallpaper, changWallpaper } = useWallpaper()

const operationalOpen = ref<boolean>(false)
const operationalOptions = [
  {
    name: '添加标签',
    icon: 'plus',
    click: () => {
      addLinkDrawer.value = true
    }
  },
  {
    name: '更换壁纸',
    icon: 'refresh',
    click: () => {
      changWallpaper()
    }
  }
]
</script>

<template>
  <div id="body-box" class="body-box">
    <div class="bg">
      <div class="cover"></div>
      <img :src="currentWallpaper?.url" :alt="changWallpaper?.name" srcset="" />
    </div>
    <div class="container">
      <weather-time class="time-el" />
      <div class="favorite-link">
        <div
          class="link-item-bg"
          v-for="(item, index) in currentFavoriteLinks"
          :key="index"
          :class="{ active: delIndex == index }"
        >
          <a class="link-item" :href="item.url">
            <el-icon size="4rem">
              <font-awesome-icon v-if="item.icon" :icon="['fab', item.icon]" inverse />
              <i-ep-link v-else />
            </el-icon>
            <div class="link-item-title">{{ item.title }}</div>
          </a>
          <el-popconfirm
            title="确定删除此标签?"
            confirm-button-text="是"
            cancel-button-text="否"
            :hide-after="0"
            @confirm="delFavoriteLink(index)"
            @cancel="delIndex = -1"
            :teleported="false"
          >
            <template #reference>
              <div class="del" :class="{ active: delIndex == index }" @click="delIndex = index">
                <el-icon size="1rem">
                  <i-ep-close-bold />
                </el-icon>
              </div>
            </template>
          </el-popconfirm>
        </div>
      </div>
    </div>
    <div class="operational-option">
      <div class="option-item" @click="operationalOpen = !operationalOpen">
        <transition name="icon-slide">
          <el-icon key="operationalOpen" size="1.5rem">
            <i-ep-ArrowRight v-if="operationalOpen" />
            <i-ep-ArrowLeft v-else />
          </el-icon>
        </transition>
      </div>
      <div
        class="options"
        :class="{ open: operationalOpen }"
        :style="{ '--option-number': operationalOptions.length }"
      >
        <div
          v-for="(item, index) in operationalOptions"
          :key="index"
          class="option-item hover"
          @click="item.click()"
        >
          <el-icon size="1.5rem">
            <i-ep-plus v-if="item.icon == 'plus'" />
            <i-ep-refresh v-if="item.icon == 'refresh'" />
          </el-icon>
        </div>
      </div>
    </div>
    <el-drawer v-model="addLinkDrawer" :with-header="false" direction="rtl" size="810px">
      <div class="favorite-link addLinkDrawer">
        <div class="link-item-bg" v-for="(item, index) in uniqueFavoriteLinks" :key="index">
          <a class="link-item" :href="item.url" @click.prevent="addFavoriteLink(item)">
            <el-icon size="4rem">
              <font-awesome-icon v-if="item.icon" :icon="['fab', item.icon]" inverse />
              <i-ep-link v-else />
            </el-icon>
            <div class="link-item-title">{{ item.title }}</div>
          </a>
        </div>
      </div>
    </el-drawer>
  </div>
</template>
<style lang="scss" scoped>
.body-box {
  width: 100%;
  height: 100%;
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

::v-deep(.el-drawer) {
  background-color: rgba(0, 0, 0, 0.25);
}

.favorite-link {
  margin-top: 6rem;
  width: 96rem;
  display: flex;
  flex-wrap: wrap;

  &.addLinkDrawer {
    margin-top: 0;
    width: 100%;
    position: relative;
    z-index: 2002;

    .link-item-bg {
      width: auto;
      display: inline;
      margin: 1rem;
      position: relative;

      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: -1;
        background-color: rgba($color: #000, $alpha: 0.25);
        backdrop-filter: blur(0.6rem);
        box-shadow: rgba(142, 142, 142, 0.19) 0rem 0.6rem 1.5rem 0rem;
        border-radius: 1.2rem;
      }

      &.active::before,
      &:hover::before {
        background-color: rgba($color: #000, $alpha: 0.45);
        box-shadow: rgba(142, 142, 142, 0.19) 0rem 0.6rem 1.5rem 0rem;
      }

      &:hover .del {
        display: flex;
      }

      .del {
        transition: all 0.5s;
        position: absolute;
        top: 0.6rem;
        right: 0.6rem;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0.3rem;
        display: none;
        cursor: pointer;
        vertical-align: middle;
        color: rgba(255, 255, 255, 0.75);
        &.active,
        &:hover {
          background-color: rgba($color: #000, $alpha: 0.25);
          backdrop-filter: blur(0.6rem);
        }
        &.active {
          display: flex;
        }
      }

      .link-item {
        width: 14rem;
        padding: 1.5rem 2rem;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        cursor: pointer;
        color: rgba(255, 255, 255, 0.75);

        .link-item-title {
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
  }

  .link-item-bg {
    width: auto;
    display: inline;
    margin: 1rem;
    position: relative;

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

    &.active::before,
    &:hover::before {
      background-color: rgba(255, 255, 255, 0.45);
      box-shadow: rgba(142, 142, 142, 0.19) 0rem 0.6rem 1.5rem 0rem;
    }

    &:hover .del {
      display: flex;
    }

    .del {
      transition: all 0.5s;
      position: absolute;
      top: 0.6rem;
      right: 0.6rem;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0.3rem;
      display: none;
      cursor: pointer;
      vertical-align: middle;
      color: rgba(255, 255, 255, 0.75);
      &.active,
      &:hover {
        background-color: rgba($color: #000, $alpha: 0.25);
        backdrop-filter: blur(0.6rem);
      }
      &.active {
        display: flex;
      }
    }

    .link-item {
      width: 14rem;
      padding: 1.5rem 2rem;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      cursor: pointer;
      color: rgba(255, 255, 255, 0.75);

      .link-item-title {
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
}

.operational-option {
  position: absolute;
  right: 1rem;
  bottom: 1rem;
  display: flex;

  .options {
    display: flex;
    width: 0;
    overflow: hidden;
    transition: width 0.3s;
    &.open {
      margin-left: 1rem;
      width: calc(3.2rem * var(--option-number));
    }
    .option-item {
      margin-right: 1rem;
    }
  }

  .option-item {
    position: relative;
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

    &.hover:hover {
      transform: rotate(180deg);
    }
  }
}
</style>
