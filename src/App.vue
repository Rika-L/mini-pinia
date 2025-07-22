<script setup>
import { useCounterStore } from './stores/counter'

const counterStore = useCounterStore()

console.log(counterStore.count)

function fn() {
  counterStore.$patch(state => {
    state.count++
  })
  console.log(counterStore.$patch)
}
</script>

<template>
  <button @click="fn">
    {{ counterStore.doubleCount }} + {{ counterStore.count }}
  </button>
</template>

<style scoped>
</style>
