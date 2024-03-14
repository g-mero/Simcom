import { For, Show, createEffect, createSignal } from 'solid-js'
import styles from '@/styles/components/pagination.module.scss'

function range(start: number, stop: number) {
  return Array.from({ length: stop - start }, (_value, index) => start + index)
}

export default function Pagination(props: {
  pageCount: number
  currentPage: number
  maxPage?: number
  disabled?: boolean
  onPagiClick: (pageNum: number) => void
}) {
  const [pages, setPages] = createSignal<number[]>([])

  createEffect(() => {
    const maxPage = props.maxPage ? props.maxPage : 7
    const centerPages = maxPage - 4
    const avaPage = centerPages + 2
    // 这里的offset是中间为偶数时右边的偏移量
    const offsetPages = Math.floor((centerPages - 1) / 2)

    if (props.pageCount <= maxPage) {
      const tmp = range(1, props.pageCount + 1)
      setPages(tmp)
    } else if (props.currentPage < avaPage) {
      const tmp = range(1, avaPage + 1).concat([0, props.pageCount])
      setPages(tmp)
    } else if (props.currentPage > props.pageCount - avaPage + 1) {
      const tmp = [1, 0].concat(
        range(props.pageCount - avaPage + 1, props.pageCount + 1),
      )
      setPages(tmp)
    } else {
      const tmp = [1, 0].concat(
        range(
          props.currentPage - (centerPages - offsetPages - 1),
          props.currentPage + offsetPages + 1,
        ).concat([0, props.pageCount]),
      )
      setPages(tmp)
    }
  })
  return (
    <Show when={props.pageCount > 1}>
      <div
        class={`${styles.pagination} ${props.disabled ? styles.disabled : ''}`}
      >
        <For each={pages()}>
          {(item) => {
            return (
              <Show
                when={item > 0}
                fallback={
                  <div class={`${styles['pagi-item']} ${styles.disabled}`}>
                    ...
                  </div>
                }
              >
                <div
                  class={`${styles['pagi-item']} ${
                    props.currentPage === item ? styles.active : ''
                  }`}
                  onClick={() => {
                    props.onPagiClick(item)
                  }}
                >
                  {item}
                </div>
              </Show>
            )
          }}
        </For>
      </div>
    </Show>
  )
}
