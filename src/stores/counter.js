import { defineStore } from '../pinia'

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
