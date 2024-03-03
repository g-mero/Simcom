/* eslint-disable solid/no-innerhtml */
import type { Accessor, Setter } from 'solid-js'
import { For, Show, createSignal, createUniqueId, useContext } from 'solid-js'
import { timePast } from '../../../utils/timeUtils'
import { CommentContext } from '../../Stores/Config'
import ScomButton from '../../components/SCButton/ScomButton'
import type { PropsOneComment } from '../../../type'
import styles from './styles.module.scss'
import Avatar from './Avatar'
import ReplyEditor from './ReplyEditor'

export default function OneReply(
  props: Omit<PropsOneComment, 'onPagiClick'> & {
    onPost: (value: string) => Promise<boolean>
    replyID: Accessor<string>
    setReplyID: Setter<string>
  },
) {
  const { state: GlobalConfig } = useContext(CommentContext)
  const id = createUniqueId()
  const isAuthed = () => GlobalConfig.userOpt.user.nickname.length > 0
  const [isProcessing, setIsProcessing] = createSignal(false)

  const show = () =>
    GlobalConfig.userOpt.user.id === props.comment.userID ||
    GlobalConfig.userOpt.user.role === 1

  const actions = GlobalConfig.actionsOpt
  return (
    <div class={`${styles['one-reply']} ${styles['fade-in']}`}>
      <div class={styles['reply-main']}>
        <Avatar avatarUrl={props.comment.avatarUrl} />
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
                props.replyID() === id ? styles.active : ''
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
                    GlobalConfig.actionsOpt.onDel!(props.comment).finally(
                      () => {
                        setIsProcessing(false)
                      },
                    )
                  }}
                  text
                  disabled={isProcessing()}
                  title={'删除'}
                />
              </Show>
              <ScomButton
                icon="comment"
                onClick={() => {
                  if (props.replyID() === id) {
                    props.setReplyID('')
                    return
                  }
                  props.setReplyID(id)
                }}
                text
                active={props.replyID() === id}
                disabled={!isAuthed()}
                title={isAuthed() ? undefined : '请先登录'}
              />
            </div>
          </div>
          <div
            class={styles['comment-content']}
            innerHTML={props.comment.content}
          />
        </div>
      </div>
      <ReplyEditor
        show={props.replyID() === id}
        placeHolder={'写下回复'}
        onPost={(value) => {
          return props.onPost(value).then((res) => {
            if (res) {
              props.setReplyID('')
            }
          })
        }}
      />
    </div>
  )
}
