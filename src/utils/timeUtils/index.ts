export function timePast(time: string): string {
  const past = new Date(time)
  const now = new Date(Date.now())

  let tmp = now.getFullYear() - past.getFullYear()

  if (tmp > 0) return `${tmp}年前`
  tmp = now.getMonth() - past.getMonth()
  if (tmp > 0) return `${tmp}个月前`
  // fix：getDay是周几，Date才是几日
  tmp = now.getDate() - past.getDate()
  if (tmp > 0) return `${tmp}天前`
  tmp = now.getHours() - past.getHours()
  if (tmp > 0) return `${tmp}小时前`
  tmp = now.getMinutes() - past.getMinutes()
  if (tmp > 0) return `${tmp}分钟前`
  tmp = now.getSeconds() - past.getSeconds()
  if (tmp > 0) return `${tmp}秒前`
  return '刚刚'
}

export function timeFormat(time: string): string {
  const date = new Date(time)
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
}
