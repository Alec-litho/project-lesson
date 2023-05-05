
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
import {fetchMyPosts, addPost} from '../../features/postSlice'
import {fetchMyAlbums} from '../../features/albumSlice'
import {selectIsAuth} from '../../features/authSlice.js'

export default function Main() {
    let [isLoaded, setFinish] = useState(false)
    let [photos, setPhotos] = useState([])
    let dispatch = useDispatch()
    let myData = useSelector(state => state.auth.data)
    let isAuth = useSelector(selectIsAuth)
    let userData = useSelector(state => state.main)
    let albums = useSelector(state => state.albums.albums)
    let userPosts = useSelector(state => state.userPosts.myPosts)
    console.log(albums);
    useEffect(() => {
        ( async function loadPhotos() {
            dispatch(fetchData(myData.token))
            dispatch(fetchMyPosts(myData._id))
            await dispatch(fetchMyAlbums({userid: myData._id, token: myData.token}))
            setFinish(true)
            setPhotos(albums)
        })()
    },[isAuth])
    return (
        <div className='mainpage'>
            <Profile fullName={userData.userInfo.name} age={userData.userInfo.age} friends={userData.userInfo.friends} profilePicture={userData.userInfo.profilePicture} location={userData.userInfo.location}/>
            <div className='mainContent'>
                <AboutMeBlock galleryPhotos={photos} isloadedState={isLoaded}/>
                <PostBlock posts={userPosts} dispatch={dispatch}/>
            </div>
            <Sidebar/>
        </div>
    )
}
function Sidebar() {
    return (
        <div className='sidebar'>
          
        </div>
    )
}
function Profile(props) {
    console.log(props);
    // let profPicture = props.profilePicture? props.profilePicture : null
    return (
        <div className='profileContainer'>
            <img src={props.profilePicture} className='pofilePicture'></img>
            <div className='infoBlock'>
            <h1>{props.fullName}</h1>
            <div className='defaultInfo'>
                <div className='leftInfoBlock'>
                    <p>Location:</p>
                    <p>Friends:</p>
                    <p>Age:</p>
                </div>
                <div className='rightInfoBlock'>
                    <a href="#">{props.location}</a>
                    <a href="#">{props.friends}</a>
                    <a href="#">{props.age}</a>
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
    // let [post, setPost] = useState([...props.posts])
    let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    let tools = useRef(null)
    let textArea = useRef(<textarea>nothing</textarea>)
    // function savePost(e) {
    //     setPost(prev => [...prev, {date: day + '.' + month, year: date.getFullYear(),comments: e.target.parentNode.parentNode.childNodes[1].value}])
    // }
    // savePost(post)
    function showTools() { tools.current.style.display = "flex"}
    function hideTools() {setTimeout(_ => tools.current.style.display = "none",200)}
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
                   <button className="publish hide" >Publish</button>
                   <a href='' className='append'> <Append className='appendIcon'/> <p>Append</p></a>
                </div>
            </div>
            <div className='postsList'>{props.posts.map((post,id) => {
                let year = post.createdAt.slice(0,4)
                let month = post.createdAt.slice(5,7)
                month = month[0] === '0'?  +month[1] - 1 : +month - 1
                let day = post.createdAt.slice(8,10)
                let time = post.createdAt.slice(11,16)
                return <Post key={id} date={months[month] + ' ' + day} time={time} year={year} text={post.text}/>
            })}
            </div>
        </div>
    )
}

function Post(props) {
    return (
        <div className='post'>
        <div className='postHeader'>
          <div><img className="profileCircle" ></img></div>
          <div className='date'>published on {props.date} {props.year} at {props.time}</div>
          <div className='postTools'>
            <Delete className='icon'/>
            <Change className='icon'/>
          </div>
        </div>
        <div className='text'>{props.text}</div>
        </div>
    )
}