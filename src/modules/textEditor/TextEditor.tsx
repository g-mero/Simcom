import { Show, createSignal, useContext } from 'solid-js'
import ScomButton from '../components/SCButton/ScomButton'
import { CommentContext } from '../Stores/Config'
import styles from './textEditor.module.scss'

export default function TextEditor() {
  const [fontCount, setFontCount] = createSignal(0)
  const [value, setValue] = createSignal('')

  const { state: GlobalConfig, setComments } = useContext(CommentContext)
  return (
    <div class={styles['text-editor-wrapper']}>
      <div class={styles['scom-textarea']}>
        <textarea
          placeholder={GlobalConfig.editorOpt.placeHolder}
          maxLength={GlobalConfig.editorOpt.maxLength}
          onInput={(ev) => {
            setValue(ev.target.value)
            setFontCount(ev.target.value.length)
          }}
        />
        <div class={styles['text-tools']}>
          <div />
          <div style={{ opacity: '0.7' }}>{`${fontCount()}/${
            GlobalConfig.editorOpt.maxLength
          }`}</div>
        </div>
      </div>

      <div class={styles['editor-toolbar']}>
        <div class="color-light">
          <Show
            when={GlobalConfig.userOpt.user.id > 0}
            fallback={<LoginInfo />}
          >
            欢迎你，{GlobalConfig.userOpt.user.nickname}
          </Show>
        </div>
        <div>
          <ScomButton
            type="primary"
            onClick={() => {
              GlobalConfig.editorOpt
                .onPost(value())
                .then((res) => {
                  setComments((prev) => {
                    return [res, ...prev]
                  })
                })
                .catch((e) => {
                  throw e
                })
            }}
            disabled={!GlobalConfig.userOpt.user.id || !value().trim()}
          >
            {GlobalConfig.userOpt.user.id ? '评论' : '登录后评论'}
          </ScomButton>
        </div>
      </div>
    </div>
  )
}

function LoginInfo() {
  const { state: GlobalConfig } = useContext(CommentContext)

  return (
    <>
      <span>您还没有登录，请</span>
      <span
        class={styles['click-text']}
        onClick={() => {
          GlobalConfig.userOpt.onLogin()
        }}
      >
        登录
      </span>
    </>
  )
}

export function ReplyTextEditor(props: {
  placeHolder?: string
  onPost: (value: string) => void
}) {
  const [fontCount, setFontCount] = createSignal(0)
  const [value, setValue] = createSignal('')

  const { state: GlobalConfig } = useContext(CommentContext)

  return (
    <div class={styles['reply-editor-wrapper']}>
      <div class={styles['scom-textarea']}>
        <textarea
          placeholder={props.placeHolder || GlobalConfig.editorOpt.placeHolder}
          maxLength={GlobalConfig.editorOpt.maxLength}
          onInput={(ev) => {
            setValue(ev.target.value)
            setFontCount(ev.target.value.length)
          }}
        />
        <div class={styles['text-tools']}>
          <div />
          <div style={{ opacity: '0.7' }}>{`${fontCount()}/${
            GlobalConfig.editorOpt.maxLength
          }`}</div>
        </div>
      </div>

      <div class={styles['send-btn']}>
        <ScomButton
          type="primary"
          onClick={() => {
            props.onPost(value())
          }}
          disabled={!GlobalConfig.userOpt.user.id || !value().trim()}
        >
          {GlobalConfig.userOpt.user.id ? '评论' : '登录后回复'}
        </ScomButton>
      </div>
    </div>
  )
}
