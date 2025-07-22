import { isReactive, isRef, toRaw, toRef } from 'vue'

export function storeToRefs(store) {
  store = toRaw(store)

  const result = {}

  for (const key in store) {
    const value = store[key]
    if (isRef(value) || isReactive(value)) {
      result[key] = toRef(store, key)
    }
  }

  return result
}
