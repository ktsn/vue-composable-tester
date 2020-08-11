# Vue Composable Tester

Utility to test composition api functions for Vue.js

## Install

```sh
$ npm install -D vue-composable-tester
```

## Supported Vue versions

Vue Composable Tester supports both Vue v3 and Vue v2 with [`@vue/composition-api`](https://github.com/vuejs/composition-api).

## Example

### Basic usage

Let's say we have the following composable to be tested:

```js
import { ref } from 'vue'

export function useCounter() {
  const count = ref(0)

  function increment() {
    count.value++
  }

  return {
    count,
    increment
  }
}
```

You can test it by wrapping with `mount` helper. The return value of `mount` includes `result` property that is the result of the composable function:

```js
import { mount } from 'vue-composable-tester'
import { useCounter } from './counter'

test('should increment count', () => {
  const { result } = mount(() => useCounter())

  expect(result.count.value).toBe(0)
  result.increment()
  expect(result.count.value).toBe(1)
})
```

### Trigger mount/unmount lifecycle

Since `mount` helper actually mounts a component under the hood, `onMount` and related lifecycle hooks will be called respectively:

```js
import { mount } from 'vue-composable-tester'
import { onMounted, nextTick } from 'vue'

function useCounter(fetchCount) {
  const count = ref(0)

  onMounted(() => {
    fetchCount().then((result) => {
      count.value = result
    })
  })

  return {
    count,
  }
}

test('fetches count on mount', async () => {
  // Mock fetch function with count 100
  const fetchMock = jest.fn().mockResolvedValue(100)

  const { result } = mount(() => useCounter(fetchMock))

  // You may want to wait until mocked value is resolved
  await nextTick()

  expect(result.count.value).toBe(100)
})
```

You can unmount the underlying component by using `unmount` helper returned by `mount` to trigger `onUnmounted` and related lifecycle hooks:

```js
const { result, unmount } = mount(() => useCounter())

// Unmount underlying comonent to trigger lifecycle hooks
unmount()
```

### `provide`/`inject`

When you have some `inject`ed values in your composables, you can mock them by using `provide` helper in `provider` option of `mount` helper:

```js
import { mount } from 'vue-composable-tester'
import { inject, provide } from 'vue'

function useCounter() {
  const store = inject('store')
  const count = computed(() => store.state.count)

  return {
    count,
  }
}

test('should be injected', () => {
  const { result } = mount(() => useCounter(), {
    provider: () => {
      provide('store', {
        state: {
          count: 10
        }
      })
    },
  })
  expect(result.count.value).toBe(10)
})
```


## License

MIT
