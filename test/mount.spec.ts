import { ref, inject, provide, onUnmounted, onMounted } from 'vue'
import { mount } from '../src/mount'

describe('mount', () => {
  it('returns the result of passed composable', () => {
    function useTest() {
      const test = ref('value')
      return {
        test,
      }
    }
    const { result } = mount(() => useTest())
    expect(result.test.value).toBe('value')
  })

  it('mounts the underlying component', () => {
    const spy = jest.fn()
    function useTest() {
      onMounted(spy)
    }
    mount(() => useTest())
    expect(spy).toHaveBeenCalled()
  })

  it('allows to unmount the underlying component', () => {
    const spy = jest.fn()
    function useTest() {
      onUnmounted(spy)
    }
    const { unmount } = mount(() => useTest())
    expect(spy).not.toHaveBeenCalled()
    unmount()
    expect(spy).toHaveBeenCalled()
  })

  it('allows to provide a value', () => {
    function useTest() {
      const injected = inject('test')
      return {
        injected,
      }
    }

    const { result } = mount(() => useTest(), {
      provider: () => {
        provide('test', 'value')
      },
    })
    expect(result.injected).toBe('value')
  })
})
