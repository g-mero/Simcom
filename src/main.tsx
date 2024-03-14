/* @refresh reload */
import { createStore } from 'solid-js/store'
import { render } from 'solid-js/web'

import App from './App'
import { CommentContext, getDefaultConfig } from './controllers/Config'
import type { SimComInst, TypeComment, TypeConfig, TypeUser } from './type'
import { validateUser } from './controllers/validator'

export type { TypeComment, TypeUser }

export default function SimCom(el: HTMLDivElement) {
  return createInst(el)
}

function createInst(el: HTMLDivElement) {
  const [configStore, setConfigStore] = createStore(getDefaultConfig())
  const setComments = (setFunc: (prev: TypeComment[]) => TypeComment[]) => {
    const prev = configStore.commentsOpt.comments

    const newCmt = setFunc([...prev])

    setConfigStore('commentsOpt', { comments: newCmt })
  }

  const setLoading = (bool: boolean) => {
    setConfigStore('loading', bool)
  }

  // prevent reduplicate
  let isInited = false

  // config
  const config = (opt: Partial<TypeConfig>) => {
    opt.commentsOpt && setConfigStore('commentsOpt', { ...opt.commentsOpt })
    opt.userOpt && setConfigStore('userOpt', { ...opt.userOpt })
    opt.editorOpt && setConfigStore('editorOpt', { ...opt.editorOpt })
    opt.actionsOpt && setConfigStore('actionsOpt', { ...opt.actionsOpt })
  }

  const setUser = (user?: Partial<TypeUser>) => {
    const newUser = Object.assign(
      { id: '', avatarUrl: '', nickname: '', role: 2, email: '' },
      user,
    )
    config({ userOpt: { user: newUser } })
  }

  // 初始化，挂载到dom
  const init = (opt: Partial<TypeConfig>) => {
    if (isInited) {
      console.warn('simcom', '阻止了重复的初始化行为，请不要重复初始化')
      return
    }
    if (opt) {
      config(opt)
    }
    isInited = true
    el.innerHTML = ''
    render(
      () => (
        <CommentContext.Provider
          value={{
            state: configStore,
            setComments,
            setLoading,
            userState: () => {
              const { user } = configStore.userOpt
              if (!user) return 'none'
              if (user.id) {
                return 'login_user'
              } else if (validateUser(user)) {
                return 'normal_user'
              }
              return 'none'
            },
            setUser,
          }}
        >
          <App loading={configStore.loading} />
        </CommentContext.Provider>
      ),
      el,
    )
  }

  const scomInst: SimComInst = {
    loading: {
      start() {
        setLoading(true)
      },
      close() {
        setLoading(false)
      },
      status() {
        return configStore.loading
      },
    },
    init,
    setUser,
    setData(data) {
      if (data) {
        setComments(() => data)
      } else setComments(() => [])
    },
    config,
  }

  return scomInst
}
