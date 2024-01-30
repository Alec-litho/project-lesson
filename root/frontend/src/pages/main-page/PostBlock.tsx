import { useAppDispatch, useAppSelector } from "../../hooks/reduxCustomHooks";
import { useState, useRef, useEffect } from "react";
import postImage from '../../helper_functions/postImage.js'
import Post from '../../components/Post.jsx';
import classes from './style/userPage.module.css'
import {fetchUserPosts, createPost, removeRecommendation,setViewedPostsCount} from '../../features/postSlice'
import {uploadImage} from '../../features/albumSlice';
import { ReactComponent as Append } from '../../assets/icons/append.svg';
// import { ReactComponent as Append } from '../../assets/icons/append.svg'
// import { ReactComponent as Tags } from '../../assets/icons/tags.svg'
import viewCount from '../../helper_functions/viewCount'
import axios from "axios";
import { Dispatch, SetStateAction } from "react";
import Loader from "../../components/Loader";
import { set } from "react-hook-form";

type PostBlock = {
    setSliderTrue: Dispatch<SetStateAction<boolean>>;
    setCurrPictureId: Dispatch<SetStateAction<string | null>>;
    currPictureId: string | null;
    user: IUser;
}
type currPostType = {
    postId:string,
    watched:boolean,
    positionY:number
}
export default function PostBlock({setSliderTrue,setCurrPictureId,currPictureId,user}:PostBlock) {
    let userPosts = useAppSelector(state => state.userPosts)
    let auth = useAppSelector(state => state.auth)
    let tools = useRef<HTMLDivElement>(null)
    let append = useRef(null)
    let textArea = useRef<HTMLTextAreaElement>(null)
    let [posts, setPosts] = useState<IPost[] | [] | null>(null)
    let [currPosts, setCurrPosts] = useState<currPostType[] | []>([])
    let [focus, setFocus] = useState(false)
    let [loader, setLoader] = useState(true)
    let [imagesToAppend, setImagesToAppend] = useState<ImageModel[] | []>([])
    let dispatch = useAppDispatch()
    let viewedPosts = userPosts.lastViewedPosts//number of posts that were viewed to user after loading another new posts (initially its 0)
    window.onscroll = () => viewedPosts = viewCount({user, dispatch, currPosts, viewedPosts, setPosts, setViewedPostsCount, setLoader});

    useEffect(() => {
        console.log(posts);
        
        if(posts===null) {
            dispatch(fetchUserPosts({_id:user._id, token:"token",count:currPosts.length}))
            .then((response:any) => {
              setPosts(response.payload.posts)
              setLoader(false)
            })
        } 
    }, [posts])

    
    function appendImage(target:EventTarget) {
        postImage(target,false/*album*/,false/*postId*/).then(res => {//saves image to 'imgbb.com' server
            dispatch(uploadImage({image:{...res, user: user._id,description:""}, token:"token"}))//saves information about image to mongodb 
            .then(({payload}:{payload:any}) => {
                setImagesToAppend(prev => [...prev, payload])
            })
        })
    }
    function loadImages() {
        if(imagesToAppend.length===0) savePost()
        else {
            imagesToAppend.forEach((img) => {
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
            if(textArea.current) {
                const post = res.payload as IPost
                textArea.current.value = ''
                textArea.current.style.height = 50 + 'px'
                setImagesToAppend([])
                const val = posts!==null? [post,...posts] : []
                setPosts(val);
            }
          })
    }
    function removeFromRecommendations(postId:string) {
        const filteredPosts = posts?.filter(post => post._id !== postId) as IPost[];
        setPosts(filteredPosts);
        dispatch(removeRecommendation({postId, userId:user._id}))
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
                   <div  className={classes.appendWrapper}>
                      <Append className={classes.icon} />
                      <input className={classes.append} id="image-append" ref={append} type="file" onInput={e => appendImage(e.target)}></input>
                   </div>
                   
                </div>
            </div>}
            <div className={classes.postsList}>{
                posts?.map((post,id) => {
                    return <Post key={id} author={user} visitor={auth.userInfo} post={post}setCurrPosts={setCurrPosts}setSliderTrue={setSliderTrue}token={"token"} 
                    setCurrPictureId={setCurrPictureId} currPictureId={currPictureId} removeFromRecommendations={removeFromRecommendations} setPosts={setPosts}
                    />
                })
            }
            </div>
            {loader? <Loader></Loader> : <div style={{"height":"100px"}}/*without this user cant scroll last post to the top of the screen to make it viewed*//>}
        </div>
    )
}

