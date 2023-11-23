import { random } from 'lodash-es'

const users: {
  id: number
  nickName: string
  avatarUrl: string
  tags?: string[]
}[] = []

function randTags() {
  const tags = ['博主', '管理员', '游客', '路人甲', '大佬']

  const result: string[] = []

  const max = random(0, 3)

  for (let index = 0; index < max; index++) {
    // pushUnique
    const tag = tags[random(0, tags.length - 1)]
    if (!result.includes(tag)) result.push(tag)
  }

  return result
}

for (let index = 0; index < 10; index++) {
  const tags = random(0, 1) ? randTags() : undefined
  const user = {
    id: index + 1,
    nickName: `测试用户 ${index + 1}`,
    avatarUrl: `/test/avatar/(${index + 1}).jpg`,
    tags,
  }

  users.push(user)
}

export { users }
