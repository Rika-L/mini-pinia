import { computed, ref } from 'vue'
import { defineStore } from '../pinia'

// export const useCounterStore = defineStore('counter', () => {
//   // 同组件中的 setup
//   const count = ref(0)

//   const doubleCount = computed(() => count.value * 2)

//   const increment = () => {
//     count.value++
//   }

//   return {
//     count,
//     doubleCount,
//     increment,
//   }
// })

export const useCounterStore = defineStore('counter', {
  state: () => ({
    count: 0,
  }),
  getters: {
    doubleCount() {
      console.log(this.count)
      return this.count * 2
    },
  },
  actions: {
    increment() {
      this.count++
    },
  },
})
