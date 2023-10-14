import { For, createEffect, createSignal, useContext } from 'solid-js'
import Pagination from '../components/Pagination/Pagination'
import { CommentContext } from '../Stores/Config'
import OneComment from './OneComment/OneComment'

export default function CommentsArea(props: PropsCommentArea) {
  const [currentPage, setCurrPage] = createSignal(1)
  const [comments, setComments] = createSignal<TypeComment[]>([])

  createEffect(() => {
    setComments(props.comments)
  })

  const { setLoading } = useContext(CommentContext)
  return (
    <div style={{ 'min-height': '10rem' }}>
      <For each={comments()} fallback={<Empty />}>
        {(item) => {
          return <OneComment comment={item} onPagiClick={props.onPagiClick} />
        }}
      </For>
      <Pagination
        pageCount={props.pageCount}
        currentPage={currentPage()}
        onPagiClick={(pn) => {
          setLoading(true)
          props
            .onPagiClick(pn, 0)
            .then((res) => {
              if (res.length > 0) {
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

function Empty() {
  return (
    <div
      style={{
        display: 'flex',
        height: '5em',
        'justify-content': 'center',
        'align-items': 'center',
        background: 'var(--simcom-color-textarea-bg)',
      }}
    >
      暂无评论,快来抢沙发吧
    </div>
  )
}
