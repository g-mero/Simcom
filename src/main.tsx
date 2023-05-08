/* @refresh reload */
import { createSignal } from 'solid-js'
import { createStore } from 'solid-js/store'
import { render } from 'solid-js/web'

import App from './App'
import { CommentContext, getDefaultConfig } from './modules/Stores/Config'

export default function SimCom(el: HTMLDivElement) {
  return createInst(el)
}

function createInst(el: HTMLDivElement) {
  const [loading, setLoad] = createSignal(false)

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

  let isInited = false

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
    }
  }

  const init = (opt: Partial<TypeConfig>) => {
    if (isInited) {
      console.warn('simcom', '阻止了重复的初始化行为，请不要重复初始化')
      return
    }
    if (opt) {
      config(opt)
    }
    isInited = true
    render(
      () => (
        <CommentContext.Provider value={{ state: ConfigStore, setComments }}>
          <App loading={loading()} />
        </CommentContext.Provider>
      ),
      el,
    )
  }

  const scomInst: SimComInst = {
    loading: {
      start() {
        setLoad(true)
      },
      close() {
        setLoad(false)
      },
    },
    init,
    setUser(user) {
      if (user) {
        const newUser = Object.assign(
          { id: 0, nickname: '未知用户', role: 2 },
          user,
        )

        setConfig((state) => ({
          userOpt: { user: newUser, onLogin: state.userOpt!.onLogin },
        }))
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
