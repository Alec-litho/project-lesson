export default function trimTime (str /* 2023-08-17T15:41:10.645+00:00 */) {
  if(typeof str !== 'string') return
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const year = str.slice(0, 4)
  let month = str.slice(5, 7)
  month = month[0] === '0' ? +month[1] - 1 : +month - 1
  const day = str.slice(8, 10)
  const time = str.split("T")[1].slice(0,8)
  return `${months[month]} ${day} ${year} at ${time}` //"Feb 24 2024 at 12:44:05"
}
