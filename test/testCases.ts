import { users } from './userCases'

async function fetchOneWord() {
  const res = await fetch('https://v1.hitokoto.cn')
  const { hitokoto } = await res.json()

  return hitokoto
}

function getRandInt(max: number) {
  return Math.floor(Math.random() * max)
}

const commentsTotal = new Map<number, number>()

async function genComments(num: number, pn: number) {
  const result: TypeComment[] = []
  for (let i = 0; i < num; i++) {
    const hitokoto = await fetchOneWord()

    const user = users[getRandInt(10)]

    const replys = getRandInt(9) > 4 ? getRandInt(80) : 0

    commentsTotal.set(i + 1, replys)

    const comment: TypeComment = {
      id: i + 1,
      userID: user.id,
      nickname: user.nickName,
      avatarUrl: user.avatarUrl,
      content: `${hitokoto} ${pn}`,
      replys,
      toCommentID: 0,
      toUserNickname: '',
      children: replys > 0 ? getReplys(1, i + 1, 3).data : [],
      createAt: '2023-02-19T17:33:27.1343681+08:00',
    }

    result.push(comment)
  }
  return result
}

function genReplys(num: number, pn: number) {
  const result: TypeComment[] = []
  for (let i = 0; i < num; i++) {
    const user = users[getRandInt(10)]

    const toUser = users[getRandInt(30)]

    const comment: TypeComment = {
      id: i + 1,
      userID: user.id,
      nickname: user.nickName,
      avatarUrl: user.avatarUrl,
      content: `测试回复 ${pn}`,
      replys: 0,
      toCommentID: 0,
      toUserNickname: toUser ? toUser.nickName : '',
      children: [],
      createAt: '2023-02-19T17:33:27.1343681+08:00',
    }

    result.push(comment)
  }
  return result
}

function getComments(pageNum: number, pageSize = 8) {
  const total = 88
  const pageCount = Math.ceil(total / pageSize)
  const ps = pageNum < pageCount ? pageSize : total - pageSize * (pageNum - 1)
  return new Promise<{ data: TypeComment[]; total: number }>(
    (resolve, reject) => {
      genComments(ps, pageNum)
        .then((res) => {
          resolve({ data: res, total: 88 })
        })
        .catch(() => {
          reject(new Error('网络错误'))
        })
    },
  )
}

function getReplys(pageNum: number, commentID: number, limitSize = 6) {
  const total = commentsTotal.get(commentID) || 0
  const pageSize = limitSize
  const pageCount = Math.ceil(total / pageSize)
  const ps = pageNum < pageCount ? pageSize : total - pageSize * (pageNum - 1)
  return { data: genReplys(ps, pageNum), total }
}

function postComment(value: string, toCommenID?: number, toUserID?: number) {
  const user = users[0]
  const comment: TypeComment = {
    id: getRandInt(1000),
    userID: user.id,
    nickname: user.nickName,
    avatarUrl: user.avatarUrl,
    content: value,
    replys: 0,
    toCommentID: toCommenID || 0,
    toUserNickname: toUserID ? users[toUserID - 1].nickName : '',
    children: [],
    createAt: '2023-02-19T17:33:27.1343681+08:00',
  }

  return comment
}

export { getComments, getReplys, postComment }
