import { Show, createSignal, useContext } from 'solid-js'

import ScomButton from '../components/SCButton/ScomButton'
import { CommentContext } from '../Stores/Config'
import styles from './textEditor.module.scss'

export default function TextEditor() {
  const [fontCount, setFontCount] = createSignal(0)
  const [value, setValue] = createSignal('')
  const [isPosting, setPosting] = createSignal(false)

  const { state: GlobalConfig, setComments } = useContext(CommentContext)

  // 提交按钮的提示信息
  const titleInfo = () => {
    if (GlobalConfig.userOpt.user.id > 0) {
      if (value().trim()) {
        return undefined
      } else {
        return '请输入点什么吧'
      }
    } else {
      return '请先登录'
    }
  }

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
        <div class={styles['btn-group']}>
          <Show when={!(GlobalConfig.userOpt.user.id > 0)}>
            <ScomButton
              flat={true}
              label="登录"
              type="success"
              onClick={() => {
                GlobalConfig.userOpt.onLogin()
              }}
            />
          </Show>
          <ScomButton
            label="提交"
            type="primary"
            loading={isPosting()}
            onClick={() => {
              // 非空才提交
              if (!titleInfo()) {
                setPosting(true)
                GlobalConfig.editorOpt
                  .onPost(value())
                  .then((res) => {
                    if (res) {
                      setComments((prev) => {
                        return [res, ...prev]
                      })
                    }
                  })
                  .finally(() => {
                    setPosting(false)
                  })
              }
            }}
            title={titleInfo()}
            disabled={!!titleInfo()}
          />
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
  onPost: (value: string) => Promise<void>
}) {
  const [fontCount, setFontCount] = createSignal(0)
  const [value, setValue] = createSignal('')
  const [isPosting, setPosting] = createSignal(false)

  const { state: GlobalConfig } = useContext(CommentContext)

  const titleInfo = () => {
    if (GlobalConfig.userOpt.user.id > 0) {
      if (value().trim()) {
        return undefined
      } else {
        return '请输入点什么吧'
      }
    } else {
      return '请先登录'
    }
  }

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
          label="回复"
          title={titleInfo()}
          loading={isPosting()}
          type="primary"
          onClick={() => {
            // 非空才提交
            if (!titleInfo()) {
              setPosting(true)
              props.onPost(value()).finally(() => {
                setPosting(false)
              })
            }
          }}
          disabled={!!titleInfo()}
        />
      </div>
    </div>
  )
}
