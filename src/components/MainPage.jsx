import data from '../data.json'
let {user} = data
export default function Main() {
    return (
        <div className='mainpage'>
        <Profile/>
                <div className='mainContent'>
                    <Post info = {user[0]}/>
                    <Post info = {user[1]}/>
                    <Post info = {user[2]}/>
                    <Post info = {user[3]}/>
                </div>
        </div>
    )
}

function Profile() {
    return (
        <div className='profileContainer'>
           <img src={require('../friends/p.jpg')}></img>
           <div className='infoBlock'>
            <h1>Jacob Sunny</h1>
            <ul>
                <li className='location'>Amsterdam</li>
                <li className='status'>Available now</li>
                <li className='cost'>50 per hour</li>
                <li className='contacts'>Contacts</li>
            </ul>
            <button className='book'> Book a meeting</button>
           </div>
        </div>
    )
}


function Post(props) {
    let {info} = props
    return (
        <div className='post'>
        <div className='postHeader'>
        <div><img className="profileCircle" src={require('../friends/p.jpg')}></img></div>
        <div className='date'>published on {info.date} {info.year}</div>
        </div>
        <div className='comment'>{info.comments}</div>
        </div>
    )
}