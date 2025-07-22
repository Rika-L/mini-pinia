import { computed, getCurrentInstance, inject, reactive, toRefs } from 'vue'
import { PiniaSymbol } from './rootState'

function createOptionStore(id, options, pinia) {
  const { state, actions, getters = {} } = options

  function setup() {
    pinia.state.value[id] = state ? state() : {}

    const localState = toRefs(pinia.state.value[id])

    const setupStore = Object.assign(
      localState,
      actions,
      Object.keys(getters).reduce((computeds, getterKey) => {
        computeds[getterKey] = computed(() => {
          return getters[getterKey].call(store)
        })
        return computeds
      }, {}),
    )
    return setupStore
  }

  createSetupStore(id, setup, pinia)
}

function createSetupStore(id, setup, pinia) {
  const store = reactive({})

  function wrapAction(actions) {
    return function (...args) {
      actions.call(store, ...args)
    }
  }

  const setupStore = setup() // 拿到的setupStore 没有处理this指向

  for (const prop in setupStore) {
    const value = setupStore[prop]
    if (typeof value === 'function') {
      // 处理 actions 中的函数 this 指向问题
      setupStore[prop] = wrapAction(value)
    }
  }

  Object.assign(store, setupStore)
  pinia._s.set(id, store)
}

export function defineStore(idOrOptions, setup) {
  let id
  let options

  const isSetupStore = typeof setup === 'function'

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

      if(isSetupStore) createSetupStore(id, setup, pinia)
      else createOptionStore(id, options, pinia) // 创建的store只需要存在_s中即可
    }
    const store = pinia._s.get(id) // 如果已经有了store则不用创建

    return store
  }

  return useStore
}
