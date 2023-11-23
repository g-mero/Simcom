/* eslint-disable solid/no-innerhtml */
/* eslint-disable unicorn/prefer-add-event-listener */
/* eslint-disable solid/event-handlers */
import {
  For,
  Show,
  createEffect,
  createSignal,
  createUniqueId,
  useContext,
} from 'solid-js'

import { CommentContext } from '../../Stores/Config'
import { timeFormat, timePast } from '../../../utils/timeUtils'
import Pagination from '../../components/Pagination/Pagination'
import ScomButton from '../../components/SCButton/ScomButton'
import { ReplyTextEditor } from '../../textEditor/TextEditor'
import Loading from '../../components/Loading/Loading'
import styles from './styles.module.scss'

function ReplyEditor(props: {
  show: boolean
  placeHolder?: string
  onPost: (value: string) => Promise<any>
}) {
  return (
    <div class={`${styles['open-wrapper']} ${props.show ? styles.open : ''}`}>
      <Show when={props.show}>
        <ReplyTextEditor
          placeHolder={props.placeHolder}
          onPost={(value) => {
            return props.onPost(value)
          }}
        />
      </Show>
    </div>
  )
}

// 实现互斥的回复框
const [replyID, setReplyID] = createSignal('')

const defaultAvatar =
  'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNTYgMjU2Ij48cGF0aCBmaWxsPSIjYzVjNWM1IiBkPSJNMCAwaDI1NnYyNTZIMHoiLz48Y2lyY2xlIGN4PSIxMjcuNzUiIGN5PSIxMDkuNSIgcj0iNTYuNSIgZmlsbD0iI2ZmZiIvPjxwYXRoIGQ9Ik0yMjcuNTMgMjU2SDI4LjQ3YzMuMTMtNDAuNSAyMS45OC03NS4zMSA0OC45LTk0Ljk2YTMuNzQgMy43NCAwIDAgMSA0LjguMzIgNjUuMzYxIDY1LjM2MSAwIDAgMCA5MS4yMS0uMyAzLjc0MiAzLjc0MiAwIDAgMSA0LjgtLjM1YzI3LjE1IDE5LjU4IDQ2LjIgNTQuNTYgNDkuMzUgOTUuMjl6IiBmaWxsPSIjZmZmIi8+PC9zdmc+'

// 核心
export default function OneComment(props: PropsOneComment) {
  const [replys, setReplys] = createSignal<TypeComment[]>([])

  const { state: GlobalConfig } = useContext(CommentContext)

  const isAuthed = () => GlobalConfig.userOpt.user.nickname.length > 0

  createEffect(() => {
    setReplys(props.comment.children)
  })
  const id = createUniqueId()
  return (
    <div class={`${styles['one-comment']} ${styles['fade-in']}`}>
      <div class={styles.avatar}>
        <img
          src={props.comment.avatarUrl || defaultAvatar}
          elementtiming={''}
          fetchpriority={'high'}
          alt="avatar"
          onerror={(e) => {
            e.currentTarget.src = defaultAvatar
            e.currentTarget.onerror = null
          }}
        />
      </div>
      <div class={styles['comment-main']}>
        <div class={styles['comment-header']}>
          <div style={{ display: 'flex', 'align-items': 'center' }}>
            <div
              class={styles['color-highlight']}
              style={{ 'font-size': '1.15em', 'font-weight': 'bold' }}
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
            <ScomButton
              icon="majesticons:comment-line"
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
              title={isAuthed() ? undefined : '请先登录'}
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
              />
            )
          }}
        </For>
      </div>

      <Show when={props.total > props.replys.length && !showall()}>
        <div class={styles['light-text']}>
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
        </div>
      </Show>
      {/* 分页 */}
      <Show when={showall()}>
        <div class={styles['light-text']}>
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
        </div>
      </Show>
    </>
  )
}

// 一条回复
function OneReply(
  props: Omit<PropsOneComment, 'onPagiClick'> & {
    onPost: (value: string) => Promise<boolean>
  },
) {
  const { state: GlobalConfig } = useContext(CommentContext)
  const id = createUniqueId()
  const isAuthed = () => GlobalConfig.userOpt.user.nickname.length > 0
  return (
    <div class={`${styles['one-reply']} ${styles['fade-in']}`}>
      <div class={styles['reply-main']}>
        <div class={styles.avatar}>
          <img
            src={props.comment.avatarUrl || defaultAvatar}
            elementtiming={''}
            fetchpriority={'high'}
            alt="avatar"
            onerror={(e) => {
              e.currentTarget.src = defaultAvatar
              e.currentTarget.onerror = null
            }}
          />
        </div>
        <div style={{ flex: 1 }}>
          <div class={styles['comment-header']}>
            <div>
              <div class={styles['color-highlight']}>
                {props.comment.nickname}
              </div>
              <For each={props.comment.tags}>
                {(item) => {
                  return <span class={styles.tag}>{item}</span>
                }}
              </For>
              <Show when={props.comment.at}>
                <span
                  class={styles['light-text']}
                  style={{ 'margin-left': '.25em' }}
                >
                  @{props.comment.at}
                </span>
              </Show>
            </div>
            <div
              class={`${styles.option} ${
                replyID() === id ? styles.active : ''
              }`}
            >
              <span class={styles['light-text']}>
                {timePast(props.comment.createdAt)}
              </span>
              <ScomButton
                icon="majesticons:comment-line"
                onClick={() => {
                  if (!isAuthed() || replyID() === id) {
                    setReplyID('')
                    return
                  }
                  setReplyID(id)
                }}
                text
                active={replyID() === id}
                disabled={!isAuthed()}
                title={isAuthed() ? undefined : '请先登录'}
              />
            </div>
          </div>
          <div
            class={styles['comment-content']}
            innerHTML={props.comment.content}
          />
          <ReplyEditor
            show={replyID() === id}
            placeHolder={'撰写回复'}
            onPost={(value) => {
              return props.onPost(value).then((res) => {
                res && setReplyID('')
              })
            }}
          />
        </div>
      </div>
    </div>
  )
}
