import { computed, getCurrentInstance, inject, isRef, reactive, toRefs, watch } from 'vue'
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
          const store = pinia._s.get(id) // 获取当前store
          return getters[getterKey].call(store)
        })
        return computeds
      }, {}),
    )
    return setupStore
  }

  const store = createSetupStore(id, setup, pinia)

  store.$reset = function () {
    const newState = state ? state() : {}
    this.$patch(newState) // 重置状态
  }

  return store
}

function isObject(value) {
  return value !== null && typeof value === 'object'
}

function createSetupStore(id, setup, pinia, isSetupStore) {

  function merge(target, partialState){
    for (const key in partialState) {
      if(!partialState.hasOwnProperty(key)) continue
      const targetValue =  target[key]
      const subPatch = partialState[key]

      if(isObject(subPatch) && isObject(targetValue) && !isRef(subPatch)) target[key] = merge(targetValue, subPatch) // 递归合并
      else target[key] = subPatch
    }

    return target
  }

  function $patch(partialStateOrMutator) {
    // 这里需要获取到原来的所有状态
    if(typeof partialStateOrMutator !== 'function') {
      merge(pinia.state.value[id], partialStateOrMutator)
    }else {
      partialStateOrMutator(pinia.state.value[id]) // 如果是函数则直接调用
    }
  }

  const partialStore = {
    $patch,
    $subscribe(callback) {
      watch(pinia.state.value[id], state => {
        callback({id}, state)
      })
    }
  }

  const store = reactive(partialStore)

  function wrapAction(actions) {
    return function (...args) {
      actions.call(store, ...args)
    }
  }

  const setupStore = setup() // 拿到的setupStore 没有处理this指向

  if(isSetupStore) {
    pinia.state.value[id] = {} // 用于存放setupStore的id对应的状态
  }
  for (const prop in setupStore) {
    const value = setupStore[prop]
    if (typeof value === 'function') {
      // 处理 actions 中的函数 this 指向问题
      setupStore[prop] = wrapAction(value)
    } else if (isSetupStore) { // 对setupStore做一些处理操作
      // 是用户写的componsition api
      pinia.state.value[id][prop] = value // 将用户返回的对象里的所有属性存下来
    }
  }

  Object.assign(store, setupStore)
  pinia._s.set(id, store)

  return store
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

      if(isSetupStore) createSetupStore(id, setup, pinia, isSetupStore)
      else createOptionStore(id, options, pinia) // 创建的store只需要存在_s中即可
    }
    const store = pinia._s.get(id) // 如果已经有了store则不用创建

    return store
  }

  return useStore
}
