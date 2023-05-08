const users: { id: number; nickName: string; avatarUrl: string }[] = []

for (let index = 0; index < 10; index++) {
  const user = {
    id: index + 1,
    nickName: `测试用户 ${index + 1}`,
    avatarUrl: `/test/avatar/  (${index + 1}).jpg`,
  }

  users.push(user)
}

export { users }
