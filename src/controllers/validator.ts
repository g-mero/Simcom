import { validateEmail, validateNickname } from '@/utils/validator'

export function validateUser(userInfo: {
  email: string
  nickname: string
}): boolean {
  return validateEmail(userInfo.email) && validateNickname(userInfo.nickname)
}
