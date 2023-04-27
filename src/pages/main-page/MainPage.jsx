
import {useState, useEffect, useRef} from 'react'
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios'
import {Link} from 'react-router-dom';
import Gallery from '../gallery-page/Gallery.jsx'
import Dialog from '../dialog-page/DialogPage.jsx'
import { ReactComponent as Append } from '../../assets/icons/append.svg'
import { ReactComponent as Delete } from '../../assets/icons/delete.svg'
import { ReactComponent as Change } from '../../assets/icons/change.svg'
import {fetchData, updatePosts} from '../../features/userSlice'
import {fetchPosts, addPost} from '../../features/postSlice'

export default function Main() {
    let [isLoaded, setFinish] = useState(false)
    let [photos, setPhotos] = useState([])
    let dispatch = useDispatch()
    let userData = useSelector(state => state.main)
    let userPosts = useSelector(state => state.userPosts)
    console.log(userPosts);
    useEffect(() => {
        ( function loadPhotos() {
            dispatch(fetchData())
            dispatch(fetchPosts())
            let data = axios.post('http://localhost:3001/albums').then(res => {
                setFinish(true)
                setPhotos(res.data)
            }).catch(err => console.log(err))
        })()
    },[])
    return (
        <div className='mainpage'>
        <Profile firstName={userData.userInfo.name} lastName={userData.userInfo.lastName} age={userData.userInfo.age} friends={userData.userInfo.friends} profilePicture={userData.userInfo.profilePicture} location={userData.userInfo.location} subscriptions={userData.userInfo.subscriptions}/>
                <div className='mainContent'>
                    <AboutMeBlock galleryPhotos={photos} isloadedState={isLoaded}/>
                    <PostBlock posts={userPosts.posts} dispatch={dispatch}/>
                </div>
        </div>
    )
}

function Profile(props) {
    let profPicture = props.profilePicture? props.profilePicture : require('../../assets/friends/profilePictureLoading.png')
    return (
        <div className='profileContainer'>
            <img src={profPicture}></img>
            <div className='infoBlock'>
            <h1>{props.firstName} {props.lastName}</h1>
            <div className='defaultInfo'>
                <div className='leftInfoBlock'>
                    <p>Location:</p>
                    <p>Friends:</p>
                    <p>Age:</p>
                    <p>Subscriptions:</p>
                </div>
                <div className='rightInfoBlock'>
                    <a href="#">{props.location}</a>
                    <a href="#">{props.friends}</a>
                    <a href="#">{props.age}</a>
                    <a href="#">{props.subscriptions}</a>
                </div>
            </div>
            <button className='book'> <Link to="/dialogs" element={<Dialog/>}>Message</Link></button>
            <button className='subscribe'>Subscribe</button>
           </div>
        </div>
    )
}
function AboutMeBlock(props) {
    if(!props.isloadedState) return null
    return (
        <div className='aboutMeBlock'>
            <div className='aboutMeHeader'>
                <span>20 views</span>
                <Link to="/gallery" element={<Gallery/>}>See all</Link>
            </div>
            <div className='gallery'>
                {props.galleryPhotos.map(album => {
                    if(album.name === 'My photos') {
                        return album.albumPhotos.slice(0,8).map((photoObj, id) => {
                           return (<div className='photoGallery' key={id}><img src={photoObj.displayURL}></img></div>)
                        })
                    }
                })}
            </div>
        </div>
    )
}
function PostBlock(props) {
    let [post, setPost] = useState([...props.posts])
    let date = new Date()
    let day = date.getDate()
    let month = date.getMonth() + 1
    let tools = useRef(null)
    let textArea = useRef(<textarea>nothing</textarea>)
    function savePost(data) {
      
    }
    savePost(post)
    function showTools() { tools.current.style.display = "flex"}
    function hideTools() {
        setTimeout(_ => {
            tools.current.style.display = "none"
        },200)
    }
    function addMore(e) {
        let num = (e.target.value.length)/10
        textArea.current.style.height = 50 + (5 + num) + 'px'
    }
    return (
        <div>
            <div className='makePost'>
                <h2>Make post</h2>
                <textarea ref={textArea} placeholder='Text' onFocus={showTools} onBlur={hideTools} onInput={addMore}></textarea>
                <div className='tools' ref={tools}>
                   <button className="publish hide" onClick={e => setPost(prev => [...prev, {date: day + '.' + month, year: date.getFullYear(),comments: e.target.parentNode.parentNode.childNodes[1].value}])} >Publish</button>
                   <a href='' className='append'> <Append className='appendIcon'/> <p>Append</p></a>
                </div>
            </div>
            <div className='postsList'>{props.posts.map((post,id) => {
                return <Post key={id} date={post.date} yeaer={post.year} comments={post.comments}/>
            })}</div>
        </div>
    )
}

function Post(props) {
    return (
        <div className='post'>
        <div className='postHeader'>
          <div><img className="profileCircle" src={require('../../assets/friends/p.jpg')}></img></div>
          <div className='date'>published on {props.date} {props.year}</div>
          <div className='postTools'>
            <Delete className='icon'/>
            <Change className='icon'/>
          </div>
        </div>
        <div className='comment'>{props.comments}</div>
        </div>
    )
}