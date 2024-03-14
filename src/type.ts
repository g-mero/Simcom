export interface TypeComment {
  // 评论的可操作用户标识符，用于actionsOpt
  userID: string
  nickname: string
  avatarUrl: string
  content: string
  at?: string // @的用户昵称
  // 附加数据，渲染到用户名下方
  extras?: string[]
  // 用户标签, 渲染到用户名右侧
  tags?: string[]
  // likes: number
  // isEdited: boolean
  createdAt: string | number | Date
  replyCount: number // 回复总数
  children: TypeComment[] // 回复
  storedData?: any // 保存的数据
}

export type UserState = 'login_user' | 'none' | 'normal_user' | undefined

export interface PropsEditor {
  placeHolder: string
  maxLength: number
  onPost: (
    value: string,
    rootComment?: TypeComment,
    parentComment?: TypeComment,
  ) => Promise<TypeComment | null>
}

export interface PropsOneComment {
  comment: TypeComment
  onPagiClick: (pn: number, rootComment: TypeComment) => Promise<TypeComment[]>
}

export interface PropsCommentArea {
  comments: TypeComment[]
  pageCount: number
  onPagiClick: (pn: number, rootComment?: TypeComment) => Promise<TypeComment[]>
}

export interface TypeUser {
  id: string
  nickname: string
  avatarUrl: string
  email: string
  role: number // 1: 博主(同时也是管理员) 2: 注册用户 0: 游客
}

export interface PropsMain {
  commentsOpt: PropsCommentArea
  editorOpt: PropsEditor
  userOpt: { user?: TypeUser; onLogin?: () => void; onLogout?: () => void }
  loading: boolean
  actionsOpt: {
    onDel?: (comment: TypeComment) => Promise<void>
    onEdit?: (comment: TypeComment, newConent: string) => Promise<void>
  }
}

export interface TypeConfig {
  commentsOpt: Partial<PropsCommentArea>
  editorOpt: Partial<PropsEditor>
  userOpt: { user?: TypeUser; onLogin?: () => void; onLogout?: () => void }
  actionsOpt: {
    onDel?: (comment: TypeComment) => Promise<void>
    onEdit?: (comment: TypeComment) => Promise<void>
  }
}

export interface SimComInst {
  loading: {
    start: () => void
    close: () => void
    status: () => boolean
  }
  init: (opt: Partial<TypeConfig>) => void
  setData: (data?: TypeComment[]) => void
  setUser: (user?: TypeUser) => void
  config: (opt: Partial<TypeConfig>) => void
}
