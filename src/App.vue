<script setup>
import { useCounterStore } from './stores/counter'

const counterStore = useCounterStore()

console.log(counterStore.count)
</script>

<template>
  <button @click="counterStore.increment">
    {{ counterStore.doubleCount }} + {{ counterStore.count }}
  </button>
</template>

<style scoped>
</style>
