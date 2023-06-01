

export default function trimTime(str) {
    let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    let year = str.createdAt.slice(0,4) 
    let month = str.createdAt.slice(5,7)
    month = month[0] === '0'?  +month[1] - 1 : +month - 1
    let day = str.createdAt.slice(8,10)
    let time = str.createdAt.slice(11,16)
    return `${months[month]} ${day} ${year} at ${time}`
}