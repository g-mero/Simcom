import type { TypeComment } from '../src/main'
import { users } from './userCases'

function fetchOneWord() {
  const time = Date.now()

  return `评论${time}`
}

function extras() {
  return ['win11', '安徽']
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
      userID: user.id,
      nickname: user.nickName,
      avatarUrl: user.avatarUrl,
      content: `${hitokoto} ${pn}`,
      replyCount: replys,
      children: replys > 0 ? getReplys(1, i + 1, 3).data : [],
      createdAt: '2023-02-19T17:33:27.1343681+08:00',
      storedData: { id: i + 1, userID: user.id },
      extras: extras(),
      tags: user.tags,
    }

    result.push(comment)
  }
  return result
}

function genReplys(num: number, pn: number) {
  const result: TypeComment[] = []
  for (let i = 0; i < num; i++) {
    const user = users[getRandInt(10)]

    const at =
      getRandInt(9) > 4 ? `${users[getRandInt(10)].nickName}` : undefined

    const comment: TypeComment = {
      userID: user.id,
      nickname: user.nickName,
      avatarUrl: user.avatarUrl,
      content: `测试回复 ${pn}`,
      replyCount: 0,
      children: [],
      createdAt: '2023-02-19T17:33:27.1343681+08:00',
      storedData: { id: i + 1, userID: user.id },
      tags: user.tags,
      at,
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

function postComment(value: string) {
  const user = users[0]
  const comment: TypeComment = {
    userID: user.id,
    nickname: user.nickName,
    avatarUrl: user.avatarUrl,
    content: value,
    replyCount: 0,
    children: [],
    createdAt: '2023-02-19T17:33:27.1343681+08:00',
    extras: extras(),
  }

  return comment
}

export { getComments, getReplys, postComment }
