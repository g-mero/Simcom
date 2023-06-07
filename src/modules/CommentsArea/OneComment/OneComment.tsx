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
import Icon from '../../components/Icon/Icon'
import Pagination from '../../components/Pagination/Pagination'
import ScomButton from '../../components/SCButton/ScomButton'
import { ReplyTextEditor } from '../../textEditor/TextEditor'
import styles from './styles.module.scss'

function ReplyEditor(props: {
  show: boolean
  placeHolder?: string
  onPost: (value: string) => void
}) {
  return (
    <div class={`${styles['open-wrapper']} ${props.show ? styles.open : ''}`}>
      <Show when={props.show}>
        <ReplyTextEditor
          placeHolder={props.placeHolder}
          onPost={(value) => {
            props.onPost(value)
          }}
        />
      </Show>
    </div>
  )
}

// 实现互斥的回复框
const [replyID, setReplyID] = createSignal('')

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
          src={props.comment.avatarUrl}
          elementtiming={''}
          fetchpriority={'high'}
          alt="avatar"
        />
      </div>
      <div class={styles['comment-main']}>
        <div class={styles['comment-header']}>
          <div>
            <div>{props.comment.nickname}</div>
            <div class={styles.date}>{timeFormat(props.comment.createAt)}</div>
          </div>
          <div class={styles.option}>
            <ScomButton
              onClick={() => {
                if (replyID() === id) setReplyID('')
                else setReplyID(id)
              }}
              text
              active={replyID() === id}
            >
              <Icon icon="majesticons:comment-line" />
            </ScomButton>
          </div>
        </div>
        <div class={styles['comment-content']}>{props.comment.content}</div>
        <ReplyEditor
          show={replyID() === id}
          onPost={(value) => {
            GlobalConfig.editorOpt.onPost(value, props.comment).then((res) => {
              setReplys((prev) => [res, ...prev])
            })
          }}
        />
        <Show when={replys().length > 0}>
          <div class={styles['comment-child']}>
            {/*  这里通过动态更新replys实现的对回复区域的动态更新 */}
            <RenderReplys
              replys={replys()}
              total={props.comment.replys}
              onPagiClick={(pn: number) => {
                return props.onPagiClick(pn, props.comment.id).then((res) => {
                  // 非空才设置
                  if (res.length > 0) {
                    setReplys(res)
                  }

                  return res
                })
              }}
              onPost={(value, toUserID) => {
                GlobalConfig.editorOpt
                  .onPost(value, props.comment, toUserID)
                  .then((res) => {
                    // 成功，push到最前面
                    setReplys((prev) => [res, ...prev])
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
  onPost: (value: string, toUserID: number) => void
}) {
  const [showall, setShowall] = createSignal(false)
  const [onPagiClick, setOnPagiClick] = createSignal<(pn: number) => void>(
    () => {},
  )
  const [currentPage, setCurPage] = createSignal(0)
  const [pageCount, setPageCount] = createSignal(0)

  createEffect(() => {
    const tmpFunc = (pn: number) => {
      props.onPagiClick(pn).then((res) => {
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
    }

    // 设置页码点击的触发函数
    setOnPagiClick(() => tmpFunc)
  })
  return (
    <>
      <For each={props.replys}>
        {(item) => {
          return (
            <OneReply
              comment={item}
              onClick={(value) => {
                props.onPost(value, item.userID)
              }}
            />
          )
        }}
      </For>
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
    onClick: (value: string) => void
  },
) {
  const id = createUniqueId()
  return (
    <div class={`${styles['one-reply']} ${styles['fade-in']}`}>
      <div class={styles['reply-main']}>
        <div class={styles.avatar}>
          <img
            src={props.comment.avatarUrl}
            elementtiming={''}
            fetchpriority={'high'}
            alt="avatar"
          />
        </div>
        <div style={{ flex: 1 }}>
          <div class={styles['comment-header']}>
            <div>
              {props.comment.nickname}
              <Show when={props.comment.toUserNickname}>
                <span
                  class={styles['light-text']}
                  style={{ 'margin-left': '.5em' }}
                >{`回复@${props.comment.toUserNickname}`}</span>
              </Show>
            </div>
          </div>
          <div class={styles['comment-content']}>{props.comment.content}</div>
          <ReplyEditor
            show={replyID() === id}
            placeHolder={`回复 @${props.comment.nickname}`}
            onPost={(value) => {
              props.onClick(value)
            }}
          />
        </div>
      </div>
      <div class={`${styles.option} ${replyID() === id ? styles.active : ''}`}>
        <span class={styles['light-text']}>
          {timeFormat(props.comment.createAt)}
        </span>
        <ScomButton
          onClick={() => {
            if (replyID() === id) setReplyID('')
            else setReplyID(id)
          }}
          text
          active={replyID() === id}
        >
          <Icon icon="majesticons:comment-line" />
        </ScomButton>
      </div>
    </div>
  )
}
