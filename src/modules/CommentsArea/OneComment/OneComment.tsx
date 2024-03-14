/* eslint-disable solid/no-innerhtml */

import {
  For,
  Show,
  createEffect,
  createSignal,
  createUniqueId,
  useContext,
} from 'solid-js'

import styles from './styles.module.scss'
import OneReply from './OneReply'
import ReplyEditor from './ReplyEditor'
import { CommentContext } from '@/controllers/Config'
import { timeFormat, timePast } from '@/utils/timeUtils'
import Pagination from '@/components/Pagination/Pagination'
import ScomButton from '@/components/SCButton/ScomButton'
import Loading from '@/components/Loading/Loading'
import type { PropsOneComment, TypeComment } from '@/type'
import Avatar from '@/components/Avatar'

// 实现互斥的回复框
const [replyID, setReplyID] = createSignal('')
// 核心
export default function OneComment(props: PropsOneComment) {
  const [replys, setReplys] = createSignal<TypeComment[]>([])

  const { state: GlobalConfig } = useContext(CommentContext)

  const isAuthed = () => !!GlobalConfig.userOpt.user?.nickname

  const [isProcessing, setIsProcessing] = createSignal(false)

  const canActions = () => {
    return (
      GlobalConfig.userOpt.user?.id === props.comment.userID ||
      GlobalConfig.userOpt.user?.role === 1
    )
  }

  createEffect(() => {
    setReplys(props.comment.children)
  })
  const id = createUniqueId()
  return (
    <div class={`${styles['one-comment']} ${styles['fade-in']}`}>
      <Avatar
        avatarUrl={props.comment.avatarUrl}
        style={{ 'margin-right': '.4em' }}
      />
      <div class={styles['comment-main']}>
        <div class={styles['comment-header']}>
          <div>
            <div
              class={styles['color-highlight']}
              style={{ 'font-size': '1.2em', 'font-weight': 'bold' }}
            >
              {props.comment.nickname}
            </div>
            <For each={props.comment.tags}>
              {(item) => {
                return <span class={styles.tag}>{item}</span>
              }}
            </For>
            <div
              class={styles.date}
              title={timeFormat(props.comment.createdAt)}
            >
              {timePast(props.comment.createdAt)}
            </div>
          </div>

          <div class={styles.option}>
            <Show when={canActions() && GlobalConfig.actionsOpt.onDel}>
              <ScomButton
                icon="delete"
                onClick={() => {
                  setIsProcessing(true)
                  GlobalConfig.actionsOpt.onDel!(props.comment).finally(() => {
                    setIsProcessing(false)
                  })
                }}
                text
                disabled={isProcessing()}
                title={'删除'}
              />
            </Show>
            <ScomButton
              icon="comment"
              onClick={() => {
                if (!isAuthed() || replyID() === id) {
                  setReplyID('')
                  return
                }
                if (replyID() === id) setReplyID('')
                else setReplyID(id)
              }}
              text
              active={replyID() === id}
              disabled={!isAuthed()}
              title={isAuthed() ? undefined : '请先完善用户信息'}
            />
          </div>
        </div>
        <div
          class={styles['comment-content']}
          innerHTML={props.comment.content}
        />
        <div class={styles['comment-extras']}>
          <For each={props.comment.extras}>
            {(item) => {
              return <span>{item}</span>
            }}
          </For>
        </div>
        {/* 这里是回复跟评论的编辑框 */}
        <ReplyEditor
          show={replyID() === id}
          onPost={(value) => {
            return GlobalConfig.editorOpt
              .onPost(value, props.comment)
              .then((res) => {
                if (res) {
                  setReplys((prev) => [res, ...prev])
                  setReplyID('')
                }
              })
          }}
        />
        <Show when={replys().length > 0}>
          <div class={styles['comment-child']}>
            {/*  这里通过动态更新replys实现的对回复区域的动态更新 */}
            <RenderReplys
              replys={replys()}
              total={props.comment.replyCount}
              onPagiClick={(pn: number) => {
                return props.onPagiClick(pn, props.comment).then((res) => {
                  // 非空才设置
                  if (res && res.length > 0) {
                    setReplys(res)
                    return res
                  }
                  return []
                })
              }}
              // 传递给子组件的父评论id
              onPost={(value, parentComment) => {
                return GlobalConfig.editorOpt
                  .onPost(value, props.comment, parentComment)
                  .then((res) => {
                    if (res) {
                      setReplys((prev) => [res, ...prev])
                      return true
                    }
                    return false
                  })
              }}
            />
          </div>
        </Show>
      </div>
    </div>
  )
}

// 每条评论的回复展示区域
function RenderReplys(props: {
  replys: TypeComment[]
  onPagiClick: (pn: number) => Promise<TypeComment[]>
  total: number
  onPost: (value: string, parentComment: TypeComment) => Promise<boolean>
}) {
  const [showall, setShowall] = createSignal(false)
  const [currentPage, setCurPage] = createSignal(0)
  const [pageCount, setPageCount] = createSignal(0)
  const [loading, setLoading] = createSignal(false)

  return (
    <>
      <div
        class={`${styles['reply-wrapper']} ${loading() ? styles.loading : ''}`}
      >
        <Show when={loading()}>
          <Loading />
        </Show>
        <For each={props.replys}>
          {(item) => {
            return (
              <OneReply
                comment={item}
                onPost={(value) => {
                  return props.onPost(value, item)
                }}
                replyID={replyID()}
                setReplyID={setReplyID}
              />
            )
          }}
        </For>
      </div>

      <div
        class={styles['light-text']}
        style={{
          'margin-top': '.5em',
        }}
      >
        <Show when={props.total > props.replys.length && !showall()}>
          <span>共有{props.total}条评论，</span>
          <span
            class={styles['click-text']}
            onClick={() => {
              setLoading(true)
              const total = props.total
              props
                .onPagiClick(1)
                .then((res) => {
                  if (res.length > 0) {
                    setCurPage(1)
                    // 根据第一页的size来确定页码
                    setPageCount(Math.ceil(total / res.length))
                    setShowall(true)
                  }
                })
                .finally(() => {
                  setLoading(false)
                })
            }}
          >
            查看全部
          </span>
        </Show>
        {/* 分页 */}
        <Show when={showall()}>
          <Pagination
            disabled={loading()}
            pageCount={pageCount()}
            currentPage={currentPage()}
            onPagiClick={(pn) => {
              setLoading(true)
              props
                .onPagiClick(pn)
                .then(() => {
                  setCurPage(pn)
                })
                .finally(() => {
                  setLoading(false)
                })
            }}
          />
        </Show>
      </div>
    </>
  )
}
