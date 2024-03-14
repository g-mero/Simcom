export function validateEmail(email: string): boolean {
  const re = /\S+@\S+\.\S+/
  return re.test(email)
}

export function validateNickname(nickname: string): boolean {
  const re = /\S{2,16}$/
  return re.test(nickname)
}
