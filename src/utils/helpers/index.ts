// 防抖
export function debounce(fn: () => void, wait: number): () => void {
  let timeout: null | number = null
  return () => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(fn, wait)
  }
}

// 节流
export function throttle(fn: () => void, wait: number): () => void {
  let timeout: null | number = null
  return () => {
    if (timeout) return
    timeout = setTimeout(() => {
      fn()
      timeout = null
    }, wait)
  }
}
