<script setup>
import { useCounterStore } from './stores/counter'

const counterStore = useCounterStore()

console.log(counterStore)
</script>

<template>
  <button @click="counterStore.count++">
    {{ counterStore.count }}
  </button>
</template>

<style scoped>
</style>
