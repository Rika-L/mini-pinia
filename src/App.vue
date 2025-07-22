<script setup>
import { useCounterStore } from './stores/counter'

const counterStore = useCounterStore()

console.log(counterStore.count)

function fn() {
  counterStore.$patch((state) => {
    state.count++
  })
  counterStore.increment()
  console.log(counterStore.$patch)
}

function reset() {
  counterStore.$reset()
}

counterStore.$subscribe((mutation, state) => {
  console.log('mutation', mutation)
  console.log('state', state)
})

counterStore.$onAction(({ after, onError }) => {
  after((result) => {
    console.log('after', result)
  })
  onError((error) => {
    console.error('error', error)
  })
})
</script>

<template>
  <button @click="fn">
    {{ counterStore.doubleCount }} + {{ counterStore.count }}
  </button>
  <button @click="reset">
    reset
  </button>
</template>

<style scoped>
</style>
