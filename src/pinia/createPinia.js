import { ref } from 'vue'
import { PiniaSymbol } from './rootState'

export function createPinia() {
  const state = ref({})

  const _p = []
  const pinia = {
    install(app) {
      // 期望所有的组件都可以访问到这个pinia
      app.config.globalProperties.$pinia = pinia
      // vue2 Vue.prototype.$pinia = pinia

      // vue3 可以通过inject 注入实例
      app.provide(PiniaSymbol, pinia)
    },
    use(plugin) {
      _p.push(plugin)
      return pinia
    },
    state,
    _s: new Map(), // 存储所有的store 每个store id -> store
    _p
  }
  return pinia
}
