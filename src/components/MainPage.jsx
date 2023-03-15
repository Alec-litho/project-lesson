import data from '../data/posts.json'
import photos from '../data/myPictures/photoData.json'
import {useState, useEffect, useRef} from 'react'
import axios from 'axios'
let {gallery} = photos
let {user} = data
export default function Main() {
    return (
        <div className='mainpage'>
        <Profile/>
                <div className='mainContent'>
                    <AboutMeBlock/>
                    <PostBlock posts={user}/>
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
function AboutMeBlock() {
    function seeMore() {

    }
    return (
        <div className='aboutMeBlock'>
            <div className='aboutMeHeader'>
                <span>20 views</span>
                <a onClick={seeMore}>See all</a>
            </div>
            <div className='gallery'>
                {gallery.map(photoObj => {
                    return (<div className='photoGallery'><img src={require(`../data/myPictures/${photoObj.id}.jpg`)}></img></div>)
                })}
            </div>
            <div className='information'>
                <div className='years'>
                    <span>9 years</span>
                    <p>Expirience</p>
                </div>
                <div className='age'>
                    <span>20 years</span>
                    <p>Age</p>
                </div>
                <div className='friends'>
                    <span>20 friends</span>
                    <p>frineds</p>
                </div>
            </div>
        </div>
    )
}
function PostBlock(props) {
    let [post, setPost] = useState([...props.posts])
    console.log(post);
    let date = new Date()
    let day = date.getDate()
    let month = date.getMonth() + 1
    axios.get('http://localhost:3001').then(res => {
        console.log(res.data);
    })
    return (
        <div>
            <div className='makePost'>
                <h2>Make post</h2>
                <textarea placeholder='Text'></textarea>
                <button onClick={e => setPost(prev => [...prev, {date: day + '.' + month, year: date.getFullYear(),comments: e.target.parentNode.childNodes[1].value}])}>Publish</button>
            </div>
            <div className='postsList'>{props.posts.map(post => {
                return <Post date={post.date} yeaer={post.year} comments={post.comments}/>
            })}</div>
        </div>
    )
}
function Post(props) {
    return (
        <div className='post'>
        <div className='postHeader'>
        <div><img className="profileCircle" src={require('../friends/p.jpg')}></img></div>
        <div className='date'>published on {props.date} {props.year}</div>
        </div>
        <div className='comment'>{props.comments}</div>
        </div>
    )
}