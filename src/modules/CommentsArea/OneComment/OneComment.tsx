/* eslint-disable unicorn/prefer-add-event-listener */
/* eslint-disable solid/event-handlers */
/* eslint-disable solid/reactivity */
import {
  For,
  Show,
  createEffect,
  createSignal,
  createUniqueId,
  useContext,
} from 'solid-js'

import { CommentContext } from '../../Stores/Config'
import { timeFormat } from '../../../utils/timeUtils'
import Pagination from '../../components/Pagination/Pagination'
import ScomButton from '../../components/SCButton/ScomButton'
import { ReplyTextEditor } from '../../textEditor/TextEditor'
import Loading from '../../components/Loading/Loading'
import styles from './styles.module.scss'

function ReplyEditor(props: {
  show: boolean
  placeHolder?: string
  onPost: (value: string) => Promise<void>
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
          <div>
            <div class={styles['color-highlight']}>
              {props.comment.nickname}
            </div>
            <div class={styles.date}>{timeFormat(props.comment.createdAt)}</div>
          </div>
          <div class={styles.option}>
            <ScomButton
              icon="majesticons:comment-line"
              onClick={() => {
                if (GlobalConfig.userOpt.user.id <= 0) {
                  setReplyID('')
                  return
                }
                if (replyID() === id) setReplyID('')
                else setReplyID(id)
              }}
              text
              active={replyID() === id}
              disabled={GlobalConfig.userOpt.user.id <= 0}
              title={GlobalConfig.userOpt.user.id <= 0 ? '请先登录' : undefined}
            />
          </div>
        </div>
        <div class={styles['comment-content']}>{props.comment.content}</div>
        <ReplyEditor
          show={replyID() === id}
          onPost={async (value) => {
            const res = await GlobalConfig.editorOpt.onPost(
              value,
              props.comment,
            )
            if (res) {
              setReplys((prev) => [res, ...prev])
            }
          }}
        />
        <Show when={replys().length > 0}>
          <div class={styles['comment-child']}>
            {/*  这里通过动态更新replys实现的对回复区域的动态更新 */}
            <RenderReplys
              replys={replys()}
              total={props.comment.replyCount}
              onPagiClick={async (pn: number) => {
                const res = await props.onPagiClick(pn, props.comment.id)
                // 非空才设置
                if (res.length > 0) {
                  setReplys(res)
                }
                return res
              }}
              onPost={async (value, toComment) => {
                const res = await GlobalConfig.editorOpt.onPost(
                  value,
                  toComment,
                )
                if (res) {
                  // 成功，push到最前面
                  setReplys((prev) => [res, ...prev])
                }
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
  onPost: (value: string, toComment: TypeComment) => Promise<void>
}) {
  const [showall, setShowall] = createSignal(false)
  const [onPagiClick, setOnPagiClick] = createSignal<(pn: number) => void>(
    () => {},
  )
  const [currentPage, setCurPage] = createSignal(0)
  const [pageCount, setPageCount] = createSignal(0)
  const [loading, setLoading] = createSignal(false)

  createEffect(() => {
    const tmpFunc = (pn: number) => {
      if (loading()) return
      setLoading(true)
      props
        .onPagiClick(pn)
        .then((res) => {
          if (res.length > 0) {
            setCurPage(pn)

            // 根据第一页的size来确定页码
            if (pn === 1) {
              setPageCount(Math.ceil(props.total / res.length))
            }

            if (!showall()) {
              setShowall(true)
            }
          }
        })
        .finally(() => {
          setLoading(false)
        })
    }

    // 设置页码点击的触发函数
    setOnPagiClick(() => tmpFunc)
  })
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
                onClick={(value) => {
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
              onPagiClick()(1)
            }}
          >
            查看全部
          </span>
        </div>
      </Show>
      <Show when={showall()}>
        <div class={styles['light-text']}>
          <Pagination
            pageCount={pageCount()}
            currentPage={currentPage()}
            onPagiClick={onPagiClick()}
          />
        </div>
      </Show>
    </>
  )
}

function OneReply(
  props: Omit<PropsOneComment, 'onPagiClick'> & {
    onClick: (value: string) => Promise<void>
  },
) {
  const { state: GlobalConfig } = useContext(CommentContext)
  const id = createUniqueId()
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
              <Show when={props.comment.toUserNickname}>
                <span
                  class={styles['light-text']}
                  style={{ 'margin-left': '.5em' }}
                >{`回复@${props.comment.toUserNickname}`}</span>
              </Show>
            </div>
            <div
              class={`${styles.option} ${
                replyID() === id ? styles.active : ''
              }`}
            >
              <span class={styles['light-text']}>
                {timeFormat(props.comment.createdAt)}
              </span>
              <ScomButton
                icon="majesticons:comment-line"
                onClick={() => {
                  if (GlobalConfig.userOpt.user.id <= 0 || replyID() === id) {
                    setReplyID('')
                    return
                  }
                  setReplyID(id)
                }}
                text
                active={replyID() === id}
                disabled={GlobalConfig.userOpt.user.id <= 0}
                title={
                  GlobalConfig.userOpt.user.id <= 0 ? '请先登录' : undefined
                }
              />
            </div>
          </div>
          <div class={styles['comment-content']}>{props.comment.content}</div>
          <ReplyEditor
            show={replyID() === id}
            placeHolder={`回复 @${props.comment.nickname}`}
            onPost={(value) => {
              return props.onClick(value)
            }}
          />
        </div>
      </div>
    </div>
  )
}
