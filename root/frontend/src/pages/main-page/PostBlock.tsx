import { useAppDispatch, useAppSelector } from "../../hooks/reduxCustomHooks";
import { useState, useRef, useEffect } from "react";
import postImage from '../../helper_functions/postImage.js'
import Post from '../../components/Post.jsx';
import classes from './style/userPage.module.css'
import {fetchUserPosts, createPost} from '../../features/postSlice'
import {uploadImage} from '../../features/albumSlice';
// import { ReactComponent as Append } from '../../assets/icons/append.svg'
// import { ReactComponent as Tags } from '../../assets/icons/tags.svg'
import viewCount from '../../helper_functions/viewCount.js'
import axios from "axios";
import trimTime from "../../helper_functions/trimTime.js";
import { Dispatch, SetStateAction } from "react";

type PostBlock = {
    setSliderTrue: Dispatch<SetStateAction<boolean>>;
    setCurrPictureId: Dispatch<SetStateAction<string | null>>;
    currPictureId: string | null;
    user: IUser;
}

export default function PostBlock({setSliderTrue,setCurrPictureId,currPictureId,user}:PostBlock) {
    let userPosts = useAppSelector(state => state.userPosts.myPosts)
    let auth = useAppSelector(state => state.auth)
    let tools = useRef<HTMLDivElement>(null)
    let append = useRef(null)
    let textArea = useRef<HTMLTextAreaElement>(null)
    let [posts, setPosts] = useState<IPost[] | []>([])
    let [currPosts, setCurrPosts] = useState([])
    let postToDetect = 0;
    //---------------------------------------
    let [update, setUpdate] = useState(false) // useless, need to get rid of this
    //---------------------------------------
    let [focus, setFocus] = useState(false)
    let [imagesToAppend, setImagesToAppend] = useState<ImageModel[] | []>([])
    let [textLeng, setTextLeng] = useState(0)
    let dispatch = useAppDispatch()
    console.log(posts);
    // window.onscroll = () => postToDetect = viewCount(auth, dispatch, currPosts, postToDetect);
    // useEffect(() => {
    //     console.log(currPosts)

    // },[currPosts])
    useEffect(() => {
        dispatch(fetchUserPosts({_id:user._id, postLength:currPosts.length, token:"token"}))
            .then((response:any) => setPosts(response.payload.posts))
    }, [])

    
    function appendImage(target:EventTarget) {
        postImage(target,false/*album*/,false/*postId*/).then(res => {//saves image to 'imgbb.com' server
            dispatch(uploadImage({image:{...res, user: user._id,description:""}, token:"token"}))//saves information about image to mongodb 
            .then(({payload}:{payload:any}) => setImagesToAppend(prev => [...prev, payload]))
        })
    }
    function loadImages() {
        if(imagesToAppend.length===0) savePost()
        else {
            imagesToAppend.forEach((img, indx) => {
                let id = img._id 
                axios.patch(`http://localhost:3001/image/${id}`)
            })
            savePost()
        }
    }
    async function savePost() {
        if(!textArea.current) return
        const post = {text: textArea.current.value, author:user._id,images: [...imagesToAppend]}
        dispatch(createPost({post, token:"token"}))
          .then(res => {
            console.log(res);
            if(textArea.current) {
                const post = res.payload as IPost
                textArea.current.value = ''
                textArea.current.style.height = 50 + 'px'
                setImagesToAppend([])
                setPosts([post,...posts]);
            }
          })
    }
    function showTools() { if(tools.current) tools.current.style.display = "flex"};
    function hideTools() {if(focus==false && imagesToAppend.length === 0)setTimeout(() => {if(tools.current) tools.current.style.display = "none"},200)};
    return (
        <div>
            {user._id === auth.userId && <div className={classes.makePost} onMouseLeave={hideTools} onMouseEnter={showTools}>
                <h2>Make post</h2>
                <textarea ref={textArea} placeholder='Text' onFocus={_ => setFocus(true)} onBlur={_ => setFocus(false)} onInput={()=>/*({target}:{target:any}) => setTextLeng(target.value.length)*/console.log("input")}></textarea>
                <div className={imagesToAppend.length !== 0? classes.imagesToAppend_show :  classes.imagesToAppend_hide}>
                    {imagesToAppend.map((image, id) => {
                        return <div key={id} className={classes.imgToAppendWrapper}>
                                   <div className={classes.background}></div>
                                   <div className={classes.imageWrapper}><img data-id={image._id} src={image.imageURL} className={classes.imageToAppend} onClick={e => {
                                       setSliderTrue(true)
                                       setCurrPictureId((prev) => { 
                                            if(e.target instanceof HTMLElement === false) return prev;
                                            let dataset = e.target.dataset.id as string
                                            return dataset 
                                       })
                                    }}/>
                                    </div>
                               </div>
                    })}
                </div>
                <div className={classes.tools} ref={tools}>
                   <button className={classes.publish} onClick={loadImages/*first, images should be updated*/}>Publish</button>
                   <input className={classes.append} id="image-append" ref={append} type="file" onInput={e => appendImage(e.target)}></input>
                </div>
            </div>}
            <div className={classes.postsList}>{
                posts.map((post,id) => {
                    return <Post key={post._id} auth={user} 
                    setCurrPosts={setCurrPosts}
                    setSliderTrue={setSliderTrue}
                    token={"token"} 
                    setCurrPictureId={setCurrPictureId} 
                    currPictureId={currPictureId} 
                    avatarUrl={user.avatarUrl} 
                    postId={post._id} 
                    views={post.viewCount} 
                    share={post.shares} 
                    likes={post.likes} 
                    postComments={post.comments} 
                    commentsNum={post.comments} 
                    date={trimTime(post.createdAt)} 
                    images={post.images} 
                    text={post.text}/>
                })
            }
            </div>
        </div>
    )
}

