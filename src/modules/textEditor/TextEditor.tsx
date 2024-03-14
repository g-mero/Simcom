import { Show, createSignal, useContext } from 'solid-js'

import styles from './textEditor.module.scss'
import { CommentContext } from '@/controllers/Config'
import ScomButton from '@/components/SCButton/ScomButton'
import TextField from '@/components/TextField'

export default function TextEditor() {
  const [value, setValue] = createSignal('')
  const [isPosting, setPosting] = createSignal(false)
  const {
    state: GlobalConfig,
    setComments,
    userState,
    setUser,
  } = useContext(CommentContext)

  // 提交按钮的提示信息
  const titleInfo = () => {
    if (userState() !== 'none') {
      if (!value().trim()) {
        return '请输入点什么吧'
      }
      return ''
    } else {
      return '请先完善用户信息'
    }
  }

  return (
    <div class={styles['text-editor-wrapper']}>
      <TextField
        type="textarea"
        value={value()}
        onChange={setValue}
        maxLength={GlobalConfig.editorOpt.maxLength}
        placeholder={GlobalConfig.editorOpt.placeHolder}
      />

      <div class={styles['editor-toolbar']}>
        <Show
          when={userState() !== 'login_user'}
          fallback={<WelcomeLoginUser />}
        >
          <NoramlUserInfoForm
            info={{
              nickname: GlobalConfig.userOpt.user?.nickname,
              email: GlobalConfig.userOpt.user?.email,
            }}
            onChange={(info) => {
              setUser(info)
            }}
          />
        </Show>

        <div
          style={{
            display: 'flex',
            'align-items': 'center',
            gap: '8px',
            'flex-wrap': 'wrap',
          }}
        >
          <Show
            when={GlobalConfig.userOpt.onLogin && userState() !== 'login_user'}
          >
            <div
              class="link-btn"
              title="直接登录"
              onClick={GlobalConfig.userOpt.onLogin}
            >
              已有本站账号?
            </div>
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

function WelcomeLoginUser() {
  const { state: GlobalConfig } = useContext(CommentContext)

  return (
    <div>
      <span>欢迎您, </span>
      <span class="link-btn" onClick={GlobalConfig.userOpt.onLogout}>
        {GlobalConfig.userOpt.user!.nickname}
      </span>
    </div>
  )
}
function NoramlUserInfoForm(props: {
  info: {
    nickname?: string
    email?: string
  }
  onChange: (info: { nickname: string; email: string }) => void
}) {
  const onChange = (key: string, value: string) => {
    const { nickname, email } = props.info
    if (nickname && email) {
      props.onChange({ nickname, email, [key]: value })
    }
  }

  return (
    <div style={{ display: 'flex', gap: '8px', 'flex-wrap': 'wrap' }}>
      <TextField
        value={props.info.nickname}
        onChange={(value) => onChange('nickname', value)}
        placeholder="昵称"
      />
      <TextField
        value={props.info.email}
        onChange={(value) => onChange('email', value)}
        placeholder="邮箱"
        type="email"
      />
    </div>
  )
}

export function ReplyTextEditor(props: {
  placeHolder?: string
  value?: string
  label?: string
  onPost: (value: string) => Promise<void>
}) {
  const [value, setValue] = createSignal('')
  const [isPosting, setPosting] = createSignal(false)

  const { state: GlobalConfig } = useContext(CommentContext)

  const titleInfo = () => {
    if (GlobalConfig.userOpt.user?.nickname) {
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
    <div
      style={{
        display: 'flex',
        width: '100%',
        margin: '.5em 0',
      }}
    >
      <div
        style={{
          flex: 1,
          'margin-right': '.6em',
        }}
      >
        <TextField
          height="4em"
          type="textarea"
          value={value()}
          onChange={setValue}
          maxLength={GlobalConfig.editorOpt.maxLength}
          placeholder={props.placeHolder}
          hideCount={true}
        />
      </div>

      <div>
        <ScomButton
          label={props.label || '回复'}
          title={titleInfo()}
          loading={isPosting()}
          style={{ height: '100%' }}
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
