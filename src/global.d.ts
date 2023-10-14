interface TypeComment {
  id: number
  userID: number
  nickname: string
  avatarUrl: string
  content: string
  // likes: number
  // isEdited: boolean
  createdAt: string
  toUserNickname: string
  toCommentID: number
  replyCount: number // 回复总数
  children: TypeComment[] // 回复
}

interface PropsEditor {
  placeHolder: string
  maxLength: number
  onPost: (
    value: string,
    toComment?: TypeComment,
  ) => Promise<TypeComment | null>
}

interface PropsOneComment {
  comment: TypeComment
  onPagiClick: (pn: number, commentID?: number) => Promise<TypeComment[]>
}

interface PropsCommentArea {
  comments: TypeComment[]
  pageCount: number
  onPagiClick: (pn: number, commentID?: number) => Promise<TypeComment[]>
}

interface TypeUser {
  id: number
  nickname: string
  avatarUrl: string
  role: number // 1: 博主(同时也是管理员) 2: 注册用户 0: 游客
}

interface PropsMain {
  commentsOpt: PropsCommentArea
  editorOpt: PropsEditor
  userOpt: { user: TypeUser; onLogin: () => void }
  loading: boolean
}

interface TypeConfig {
  commentsOpt: Partial<PropsCommentArea>
  editorOpt: Partial<PropsEditor>
  userOpt: { user?: TypeUser; onLogin?: () => void }
}

interface SimComInst {
  loading: {
    start: () => void
    close: () => void
  }
  init: (opt: Partial<TypeConfig>) => void
  setData: (data?: TypeComment[]) => void
  setUser: (user?: TypeUser) => void
  config: (opt: Partial<TypeConfig>) => void
}
