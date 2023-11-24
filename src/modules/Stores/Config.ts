import { createContext } from 'solid-js'

// 获取默认初始化设置项，这里使用函数形式是为了放在对象的引用问题，导致组件复用出现干涉
export function getDefaultConfig() {
  const defaultConfig: PropsMain = {
    commentsOpt: {
      comments: [],
      pageCount: 0,
      onPagiClick() {
        return new Promise<any>((resolve) => {
          resolve([])
        })
      },
    },
    editorOpt: {
      maxLength: 500,
      placeHolder: '善意评论',
      onPost() {
        return new Promise<TypeComment>((_resolve, reject) => {
          reject(new Error('没有设置OnPost配置项'))
        })
      },
    },
    userOpt: {
      user: { nickname: '', role: 0, avatarUrl: '' },
      onLogin() {},
      onLogout() {},
    },
    loading: false,
  }

  return defaultConfig
}

export const CommentContext = createContext({
  state: getDefaultConfig(),
  setComments: (setFunc: (prev: TypeComment[]) => TypeComment[]) => {
    setFunc([])
  },
  setLoading: (bool: boolean) => {
    console.warn(bool)
  },
})
