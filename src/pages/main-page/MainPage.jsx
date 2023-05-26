import {useState, useEffect, useRef} from 'react'
import { useDispatch, useSelector } from 'react-redux';
import {Link} from 'react-router-dom';
import Gallery from '../gallery-page/Gallery.jsx'
import Dialog from '../dialog-page/DialogPage.jsx'
import { ReactComponent as Append } from '../../assets/icons/append.svg'
import { ReactComponent as Tags } from '../../assets/icons/tags.svg'
import {fetchData, updatePosts} from '../../features/userSlice'
import {fetchMyPosts, createPost,} from '../../features/postSlice'
import {fetchMyAlbums, savePicture} from '../../features/albumSlice'
import {selectIsAuth} from '../../features/authSlice.js'
import Post from '../../components/Post.jsx';
import Slider from '../../components/Slider.jsx';
import postImage from '../../helper_functions/postImage.js'
import classes from './mainPage.module.css'

export default function Main() {
    let [isLoaded, setFinish] = useState(false)
    let [photos, setPhotos] = useState([])
    let dispatch = useDispatch()
    let auth = useSelector(state => state.auth.data)
    let isAuth = useSelector(selectIsAuth)
    let userData = useSelector(state => state.main)
    let albums = useSelector(state => state.albums.albums)
    let userPosts = useSelector(state => state.userPosts.myPosts)
    let [sliderTrue, setSliderTrue] = useState(false)
    let [currPictureId, setcurrPictureId] = useState(null)
    useEffect(() => {
        (function loadPhotos() {
            dispatch(fetchData(auth.token))
            dispatch(fetchMyPosts(auth._id))
            dispatch(fetchMyAlbums({userid: auth._id, token: auth.token}))
            setFinish(true)
            setPhotos(albums)
        })()
    },[isAuth])
    return (
        <div className={classes.mainpage}>
            <Profile fullName={userData.userInfo.name} age={userData.userInfo.age} friends={userData.userInfo.friends} profilePicture={userData.userInfo.profilePicture} location={userData.userInfo.location}/>
            <div className={classes.mainContent}>
                <AboutMeBlock galleryPhotos={photos} isloadedState={isLoaded}/>
                <PostBlock setcurrPictureId={setcurrPictureId} setSliderTrue={setSliderTrue} postImage={postImage} posts={userPosts} dispatch={dispatch} useSelector={useSelector} auth={auth} useState={useState} savePicture={savePicture}/>
            </div>
            <Sidebar/>
            <Slider sliderTrue={sliderTrue} setSliderTrue={setSliderTrue} currPictureId={currPictureId}></Slider>
        </div>
    )
}
function Sidebar() {
    return (
        <div className={classes.sidebar}>
          
        </div>
    )
}
function Profile(props) {
    // let profPicture = props.profilePicture? props.profilePicture : null
    return (
        <div className={classes.profileContainer}>
            <img src={props.profilePicture} className={classes.pofilePicture}></img>
            <div className={classes.infoBlock}>
            <h1>{props.fullName}</h1>
            <div className={classes.defaultInfo}>
                <div className={classes.leftInfoBlock}>
                    <p>Location:</p>
                    <p>Friends:</p>
                    <p>Age:</p>
                </div>
                <div className={classes.rightInfoBlock}>
                    <a href="#">{props.location}</a>
                    <a href="#">{props.friends}</a>
                    <a href="#">{props.age}</a>
                </div>
            </div>
            <button className={classes.book}> <Link to="/dialogs" element={<Dialog/>}>Message</Link></button>
            <button className={classes.subscribe}>Subscribe</button>
           </div>
        </div>
    )
}
function AboutMeBlock(props) {
    if(!props.isloadedState) return null
    return (
        <div className={classes.aboutMeBlock}>
            <div className={classes.aboutMeHeader}>
                <span>20 views</span>
                <Link to="/gallery" element={<Gallery/>}>See all</Link>
            </div>
            <div className={classes.gallery}>
                {props.galleryPhotos.map(album => {
                    if(album.name === 'My photos') {
                        return album.albumPhotos.slice(0,8).map((photoObj, id) => {
                           return (<div className={classes.photoGallery} key={id}><img src={photoObj.displayURL}></img></div>)
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
    let tags = useRef(null)
    let append = useRef(null)
    let textArea = useRef(<textarea>nothing</textarea>)
    let [focus, setFocus] = useState(false)
    let [imagesToAppend, setImagesToAppend] = useState([])

    function appendImage(e) {
        props.postImage(e.target).then(res => {
            props.dispatch(props.savePicture({picture:res, myData:props.auth}))
            .then(resp => {
                setImagesToAppend(prev => [...prev, resp.payload])
            })
        })
    }
    function filterTags(strTags) {
        let result = strTags.split(' ')
        for (let i = 0; i < result.length-1; i++) {//gets rib of repeating tags
            for (let j = i; j < result.length-1; j++) {
                if(result[i] === result[j+1]) result[i] = ''
            }    
        }
        return result.filter(str => str.length > 0)
    }
    function savePost(e) {
        let result = filterTags(tags.current.value)
        let imgs = imagesToAppend.map(img => img._id)
        // if(imagesToAppend.length>0) appendImage(e)
        props.dispatch(createPost({text: textArea.current.value, id:props.auth._id, tags:result, imageUrl: imgs, token:props.auth.token}))
    }
    function showTools() { tools.current.style.display = "flex"}
    function hideTools() {
        if(focus==false && imagesToAppend.length === 0)setTimeout(_ => tools.current.style.display = "none",200)
    }
    function addMore(e) {
        let num = (e.target.value.length)/10
        textArea.current.style.height = 50 + (5 + num) + 'px'
    }
    function addTags(e) {
        e.preventDefault()
        tags.current.style.display = 'flex'
    }
    return (
        <div>
            <div className={classes.makePost} onMouseLeave={hideTools} onMouseEnter={showTools}>
                <h2>Make post</h2>
                <textarea ref={textArea} placeholder='Text' onFocus={_ => setFocus(true)} onBlur={_ => setFocus(false)} onInput={addMore}></textarea>
                <div className={imagesToAppend.length !== 0? classes.imagesToAppend_show :  classes.imagesToAppend_hide}>
                    {imagesToAppend.map((image, id) => {
                        return <div key={id} className={classes.imgToAppendWrapper}>
                                   <div className={classes.background}></div>
                                   <img data-id={image._id} src={image.imageURL} className={classes.imageToAppend} onClick={e => {
                                       props.setSliderTrue(true)
                                       props.setcurrPictureId(e.target.dataset.id)
                                    }}/>
                               </div>
                    })}
                </div>
                <div className={classes.tools} ref={tools}>
                   <button className={classes.publish} onClick={savePost}>Publish</button>
                   <input className={classes.append} id="image-append" ref={append} type="file" onInput={e => appendImage(e)}></input>
                   <Append className={classes.appendIcon}/>
                   <a href='' className={classes.tag}> <Tags className={classes.tagsIcon} onClick={addTags}/></a>
                   <div>
                      <input ref={tags} className={classes.tagsInput} onFocus={_ => setFocus(true)} onBlur={_ => setFocus(false)} placeholder='firstTag secondTag...'/>
                   </div>
                </div>
            </div>
            <div className={classes.postsList}>{props.posts.map((post,id) => {
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

