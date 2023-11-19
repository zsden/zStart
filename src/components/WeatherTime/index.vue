<script setup lang="ts">
import { ref } from 'vue'
import { getCurrentTime } from './timeTools'
import { onMounted } from 'vue'
const ShowZero = ref(true)
const Use12Hour = ref(false)
const ShowSecond = ref(true)

const timeData = ref()
let timeInterval = ref<any>({})
function updateTimeData() {
  timeData.value = getCurrentTime(ShowZero.value, Use12Hour.value)
}

onMounted(() => {
  updateTimeData()
  timeInterval.value = setInterval(updateTimeData, 1000)
})
</script>
<template>
  <div class="weather-time" v-if="timeData">
    <div class="time">
      <div class="hour">{{ timeData?.hour }}</div>
      <span class="colon">:</span>
      <div class="minute">{{ timeData?.minute }}</div>
      <span v-if="ShowSecond" class="colon">:</span>
      <span v-if="ShowSecond" class="second">{{ timeData?.second }}</span>
      <span v-if="Use12Hour" class="amPm">PM</span>
    </div>
    <div class="lunar">
      <span class="year">{{ timeData.lunar.GanZhiYear }}</span>
      <span class="suffix">年</span>
      <span class="day weekday">{{ timeData.lunar.text }}</span>
    </div>
    <div class="date">
      <span class="month">{{ timeData.month }}</span>
      <span class="suffix">月</span>
      <span class="day">{{ timeData.day }}</span>
      <span class="suffix">日</span>
      <span class="weekday">{{ timeData.weekday }}</span>
    </div>
  </div>
</template>
<style lang="scss" socped>
$--main-text-shadow: 0rem 0rem 0.8rem #000000;

@keyframes colon-breathe {
  0% {
    opacity: 0.8;
  }
  70% {
    opacity: 0.8;
  }
  100% {
    opacity: 0.2;
  }
}

.weather-time {
  color: #fff;
  .time {
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    line-height: 6rem;
    .hour,
    .minute,
    .second {
      font-size: 4rem;
      text-shadow: $--main-text-shadow;
    }
    .colon {
      opacity: 0.8;
      font-size: 4rem;
      margin: 0 0.5rem;
      transform: translateY(-0.4rem);
      &:last-of-type {
        animation: colon-breathe 0.6s infinite alternate;
      }
    }
    .amPm {
      font-size: 1.2rem;
      opacity: 0.6;
      margin-left: 0.6rem;
      align-self: flex-end;
      transform: translateY(-0.8rem);
    }
  }
  .date,
  .lunar {
    text-align: center;
    font-size: 1.5rem;
    color: rgba($color: #fff, $alpha: 0.8);
    margin: 0.4rem 0;
    text-shadow: $--main-text-shadow;
    .suffix {
      margin: 0 0.2rem;
    }
    .weekday {
      margin-left: 0.2rem;
    }
  }
  .lunar {
    font-size: 1.1rem;
    color: rgba($color: #fff, $alpha: 0.6);
    .suffix {
      margin-left: 0;
    }
  }
}
</style>
