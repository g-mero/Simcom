import { For, createEffect, createSignal, useContext } from 'solid-js'
import OneComment from './OneComment/OneComment'
import Pagination from '@/components/Pagination/Pagination'
import { CommentContext } from '@/controllers/Config'
import type { PropsCommentArea, TypeComment } from '@/type'

// 整个评论展示区域
export default function CommentsArea(props: PropsCommentArea) {
  const [currentPage, setCurrPage] = createSignal(1)
  const [comments, setComments] = createSignal<TypeComment[]>([])

  createEffect(() => {
    setComments(props.comments)
  })

  const { state, setLoading } = useContext(CommentContext)
  return (
    <div style={{ 'min-height': '10rem' }}>
      <For each={comments()} fallback={<Empty />}>
        {(item) => {
          return <OneComment comment={item} onPagiClick={props.onPagiClick} />
        }}
      </For>
      <Pagination
        disabled={state.loading}
        pageCount={props.pageCount}
        currentPage={currentPage()}
        onPagiClick={(pn) => {
          setLoading(true)
          props
            .onPagiClick(pn)
            .then((res) => {
              if (res && res.length > 0) {
                setComments(res)
                setCurrPage(pn)
              }
            })
            .finally(() => {
              setLoading(false)
            })
        }}
      />
    </div>
  )
}

// 没有评论时的展示
function Empty() {
  const { state } = useContext(CommentContext)
  return (
    <div
      style={{
        display: 'flex',
        height: '6em',
        'justify-content': 'center',
        'align-items': 'center',
        opacity: state.loading ? 0 : 0.6,
        transition: 'all 0.3s',
      }}
    >
      暂无评论,快来抢沙发吧
    </div>
  )
}
