import { useDispatch, useSelector } from "react-redux"
import { useState, useRef, useEffect } from "react";
import postImage from '../../helper_functions/postImage.js'
import Post from '../../components/Post.jsx';
import classes from './mainPage.module.css'
import {fetchMyPosts, createPost} from '../../features/postSlice'
import {savePicture} from '../../features/albumSlice';
import { ReactComponent as Append } from '../../assets/icons/append.svg'
import { ReactComponent as Tags } from '../../assets/icons/tags.svg'

import viewCount from '../../helper_functions/viewCount.js'
import axios from "axios";
import trimTime from "../../helper_functions/trimTime.js";

export default function PostBlock({auth,setSliderTrue,setCurrPictureId,currPictureId}=props) {
    let tools = useRef(null)
    let tags = useRef(null)
    let append = useRef(null)
    let textArea = useRef(<textarea>nothing</textarea>)
    let userPosts = useSelector(state => state.userPosts.myPosts)
    let [posts, setPosts] = useState([])
    let [currPosts, setCurrPosts] = useState([...userPosts])
    let postToDetect = 0;
    //---------------------------------------
    let [update, setUpdate] = useState(false) // useless, need to get rid of this
    //---------------------------------------
    let [focus, setFocus] = useState(false)
    let [imagesToAppend, setImagesToAppend] = useState([])
    let [textLeng, setTextLeng] = useState(0)
    let dispatch = useDispatch()
    window.onscroll = () => postToDetect = viewCount(auth, dispatch, currPosts, postToDetect);
    // useEffect(() => {
    //     console.log(currPosts)

    // },[currPosts])
    useEffect(() => {
        if(userPosts.length === 0) {
            dispatch(fetchMyPosts({id:auth.userInfo._id, update:setUpdate, postLength:currPosts.length}))
        }
        else setPosts([...userPosts]);
        console.log('w');
    }, [userPosts])

    
    function appendImage(e) {
        postImage(e.target, false/*hasAlbum*/,undefined/*album*/, 'undefined'/*postId*/).then(res => {//saves image to 'imgbb.com' server
            dispatch(savePicture({imgData:res, token:auth.token}))//saves information about image to mongodb 
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
    function loadImages() {
        if(imagesToAppend.length===0) savePost()
        else {
            imagesToAppend.forEach((img, indx) => {
                let id = img._id 
                console.log(img);
                axios.post(`http://localhost:3001/images/update/${id}`)
            })
            savePost()
        }
    }
    async function savePost() {
        let result = filterTags(tags.current.value)
        let imgs = imagesToAppend.map(img => img._id)
        dispatch(createPost({text: textArea.current.value, id:auth.userInfo._id, tags:result, imageUrl: imgs, token:auth.token, update:setUpdate}))
        textArea.current.value = ''
        tags.current.value = ''
        textArea.current.style.height = 50 + 'px'
        setImagesToAppend([])
    }
    function showTools() { tools.current.style.display = "flex"}
    function hideTools() {if(focus==false && imagesToAppend.length === 0)setTimeout(_ => tools.current.style.display = "none",200)}

    function addTags(e) {
        e.preventDefault()
        tags.current.style.display = 'flex'
    }
    return (
        <div>
            <div className={classes.makePost} onMouseLeave={hideTools} onMouseEnter={showTools}>
                <h2>Make post</h2>
                <textarea ref={textArea} placeholder='Text' onFocus={_ => setFocus(true)} onBlur={_ => setFocus(false)} onInput={e => setTextLeng(e.target.value.length)}></textarea>
                <div className={imagesToAppend.length !== 0? classes.imagesToAppend_show :  classes.imagesToAppend_hide}>
                    {imagesToAppend.map((image, id) => {
                        return <div key={id} className={classes.imgToAppendWrapper}>
                                   <div className={classes.background}></div>
                                   <div className={classes.imageWrapper}><img data-id={image._id} src={image.imageURL} className={classes.imageToAppend} onClick={e => {
                                       setSliderTrue(true)
                                       setCurrPictureId(e.target.dataset.id)
                                    }}/>
                                    </div>
                               </div>
                    })}
                </div>
                <div className={classes.tools} ref={tools}>
                   <button className={classes.publish} onClick={loadImages/*first, images should be updated*/}>Publish</button>
                   <input className={classes.append} id="image-append" ref={append} type="file" onInput={e => appendImage(e)}></input>
                   <Append className={classes.appendIcon}/>
                   <a href='' className={classes.tag}> <Tags className={classes.tagsIcon} onClick={addTags}/></a>
                   <div>
                      <input ref={tags} className={classes.tagsInput} onFocus={_ => setFocus(true)} onBlur={_ => setFocus(false)} placeholder='firstTag secondTag...'/>
                   </div>
                </div>
            </div>
            <div className={classes.postsList}>{
                posts.map((post,id) => {
                    return <Post key={post._id} auth={auth.userInfo} 
                    setCurrPosts={setCurrPosts}
                    setSliderTrue={setSliderTrue}
                    token={auth.token} 
                    setCurrPictureId={setCurrPictureId} 
                    currPictureId={currPictureId} 
                    avatarUrl={auth.userInfo.avatarUrl} 
                    postId={post._id} 
                    views={post.viewsCount} 
                    share={post.share} 
                    likes={post.likes} 
                    comments={post.comments} 
                    commentsNum={post.commentsNum} 
                    date={trimTime(post.createdAt)} 
                    images={post.images} 
                    text={post.text}/>
                })
            }
            </div>
        </div>
    )
}