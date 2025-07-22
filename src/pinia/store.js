import { getCurrentInstance, inject, reactive } from 'vue'
import { PiniaSymbol } from './rootState'

function createOptionStore(id, options, pinia) {
  const { state } = options

  const store = reactive({})
  Object.assign(store, state())
  pinia._s.set(id, store)
}

export function defineStore(idOrOptions, setup) {
  let id
  let options

  // 对用户的两种写法做一个处理
  if (typeof idOrOptions === 'string') {
    id = idOrOptions
    options = setup
  }
  else {
    options = idOrOptions
    id = idOrOptions.id
  }

  function useStore() {
    // 这个 useStore 只能在组件中使用
    const currentInstance = getCurrentInstance()
    const pinia = currentInstance && inject(PiniaSymbol)

    if (!pinia._s.has(id)) {
      // 第一次使用pinia
      createOptionStore(id, options, pinia) // 创建的store只需要存在_s中即可
    }
    const store = pinia._s.get(id) // 如果已经有了store则不用创建

    return store
  }

  return useStore
}
