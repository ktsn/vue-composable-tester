export interface MountResult<R> {
  result: R
  unmount: () => void
}

export interface MountOptions {
  provider?: () => void
}

export function mount<R>(
  composable: () => R,
  options: MountOptions = {}
): MountResult<R> {
  const version = require('vue').version || require('vue').default.version
  return /^3\./.test(version)
    ? mountV3(composable, options)
    : mountV2(composable, options)
}

function mountV2<R>(
  composable: () => R,
  options: MountOptions
): MountResult<R> {
  const Vue = require('vue').default
  const app = new Vue({
    setup() {
      options.provider?.()

      const result = composable()
      const wrapper = () => result
      return { wrapper }
    },
  })

  app.$mount()

  return {
    result: app.wrapper(),

    unmount: () => app.$destroy(),
  }
}

function mountV3<R>(
  composable: () => R,
  options: MountOptions
): MountResult<R> {
  const { createApp } = require('vue')
  const App = {
    setup() {
      options.provider?.()

      const result = composable()
      const wrapper = () => result
      return { wrapper }
    },

    render() {},
  }
  const root = document.createElement('div')
  const app = createApp(App)
  const vm = app.mount(root)

  return {
    result: vm.wrapper(),

    unmount: () => app.unmount(),
  }
}
