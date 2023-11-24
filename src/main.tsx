/* @refresh reload */
import { createStore } from 'solid-js/store'
import { render } from 'solid-js/web'

import App from './App'
import { CommentContext, getDefaultConfig } from './modules/Stores/Config'

export default function SimCom(el: HTMLDivElement) {
  return createInst(el)
}

function createInst(el: HTMLDivElement) {
  const [ConfigStore, setConfig] = createStore(getDefaultConfig())
  const setComments = (setFunc: (prev: TypeComment[]) => TypeComment[]) => {
    const prev = ConfigStore.commentsOpt.comments

    const newCmt = setFunc([...prev])

    setConfig((state) => ({
      commentsOpt: {
        comments: newCmt,
        onPagiClick: state.commentsOpt.onPagiClick,
        pageCount: state.commentsOpt.pageCount,
      },
    }))
  }
  const setLoading = (bool: boolean) => {
    setConfig(() => ({
      loading: bool,
    }))
  }

  // prevent reduplicate
  let isInited = false

  // config
  const config = (opt: Partial<TypeConfig>) => {
    if (opt) {
      if (opt.commentsOpt) {
        const commentsOpt = opt.commentsOpt
        setConfig((state) => ({
          commentsOpt: {
            comments: commentsOpt.comments || state.commentsOpt.comments,
            onPagiClick:
              commentsOpt.onPagiClick || state.commentsOpt.onPagiClick,
            pageCount: commentsOpt.pageCount || state.commentsOpt.pageCount,
          } as PropsCommentArea,
        }))
      }

      if (opt.userOpt) {
        const userOpt = opt.userOpt
        setConfig((state) => ({
          userOpt: {
            user: userOpt.user || state.userOpt.user,
            onLogin: userOpt.onLogin || state.userOpt.onLogin,
            onLogout: userOpt.onLogout || state.userOpt.onLogout,
          },
        }))
      }

      if (opt.editorOpt) {
        const editorOpt = opt.editorOpt
        setConfig((state) => ({
          editorOpt: {
            placeHolder: editorOpt.placeHolder || state.editorOpt.placeHolder,
            maxLength: editorOpt.maxLength || state.editorOpt.maxLength,
            onPost: editorOpt.onPost || state.editorOpt.onPost,
          } as PropsEditor,
        }))
      }

      if (opt.actionsOpt) {
        const actionsOpt = opt.actionsOpt
        setConfig((state) => ({
          actionsOpt: {
            onDel: actionsOpt.onDel || state.actionsOpt.onDel,
            onEdit: actionsOpt.onEdit || state.actionsOpt.onEdit,
          },
        }))
      }
    }
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
          value={{ state: ConfigStore, setComments, setLoading }}
        >
          <App loading={ConfigStore.loading} />
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
        return ConfigStore.loading
      },
    },
    init,
    setUser(user) {
      if (user) {
        const newUser = Object.assign(
          { id: '', avatarUrl: '', nickname: '', role: 2 },
          user,
        )

        setConfig((state) => ({
          userOpt: {
            user: newUser,
            onLogin: state.userOpt!.onLogin,
            onLogout: state.userOpt!.onLogout,
          },
        }))
      } else {
        this.setUser({} as TypeUser)
      }
    },
    setData(data) {
      if (data) {
        setConfig((state) => ({
          commentsOpt: {
            comments: data,
            pageCount: state.commentsOpt.pageCount,
            onPagiClick: state.commentsOpt.onPagiClick,
          },
        }))
      } else
        setConfig((state) => ({
          commentsOpt: {
            comments: [],
            pageCount: state.commentsOpt.pageCount,
            onPagiClick: state.commentsOpt.onPagiClick,
          },
        }))
    },
    config,
  }

  return scomInst
}
