import type { Setter } from 'solid-js'
import {
  For,
  Show,
  createEffect,
  createSignal,
  createUniqueId,
  useContext,
} from 'solid-js'
import styles from './styles.module.scss'
import ReplyEditor from './ReplyEditor'
import { timePast } from '@/utils/timeUtils'
import { CommentContext } from '@/controllers/Config'
import ScomButton from '@/components/SCButton/ScomButton'
import type { PropsOneComment } from '@/type'
import Avatar from '@/components/Avatar'

export default function OneReply(
  props: Omit<PropsOneComment, 'onPagiClick'> & {
    onPost: (value: string) => Promise<boolean>
    replyID: string
    setReplyID: Setter<string>
  },
) {
  const { state: GlobalConfig } = useContext(CommentContext)
  const id = createUniqueId()
  const [rid, setRid] = createSignal(false)
  createEffect(() => {
    rid() && props.setReplyID('')
    setRid(false)
  })
  const isAuthed = () => GlobalConfig.userOpt.user?.nickname
  const [isProcessing, setIsProcessing] = createSignal(false)

  // 判断操作权限
  const show = () => {
    const { user } = GlobalConfig.userOpt

    return (user?.id && user.id === props.comment.userID) || user?.role === 1
  }

  const actions = GlobalConfig.actionsOpt
  return (
    <div class={`${styles['one-reply']} ${styles['fade-in']}`}>
      <div
        style={{
          display: 'flex',
          flex: 1,
        }}
      >
        <Avatar
          avatarUrl={props.comment.avatarUrl}
          style={{ 'font-size': '.8em', 'margin-right': '4px' }}
        />
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
                props.replyID === id ? styles.active : ''
              }`}
            >
              <span class={styles['light-text']}>
                {timePast(props.comment.createdAt)}
              </span>

              <Show when={show() && actions.onDel}>
                <ScomButton
                  icon="delete"
                  onClick={() => {
                    setIsProcessing(true)
                    GlobalConfig.actionsOpt
                      .onDel?.(props.comment)
                      .finally(() => {
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
                  if (props.replyID === id) {
                    props.setReplyID('')
                    return
                  }
                  props.setReplyID(id)
                }}
                text
                active={props.replyID === id}
                disabled={!isAuthed()}
                title={isAuthed() ? undefined : '请先登录'}
              />
            </div>
          </div>
          <div
            style={{
              'min-height': '2em',
              'padding-top': '.3em',
            }}
          >
            {props.comment.content}
          </div>
        </div>
      </div>
      <ReplyEditor
        show={props.replyID === id}
        placeHolder={'写下回复'}
        onPost={(value) => {
          return props.onPost(value).then((res) => {
            res && setRid(true)
          })
        }}
      />
    </div>
  )
}
