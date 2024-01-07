import { useAppDispatch, useAppSelector } from "../../hooks/reduxCustomHooks";
import { useState, useRef, useEffect } from "react";
import postImage from '../../helper_functions/postImage.js'
import Post from '../../components/Post.jsx';
import classes from './style/mainPage.module.css'
import {fetchMyPosts, createPost} from '../../features/postSlice'
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
}

export default function PostBlock({setSliderTrue,setCurrPictureId,currPictureId}:PostBlock) {
    let tools = useRef<HTMLDivElement>(null)
    let append = useRef(null)
    let textArea = useRef<HTMLTextAreaElement>(null)
    let userPosts = useAppSelector(state => state.userPosts.myPosts)
    let auth = useAppSelector(state => state.auth)
    let [posts, setPosts] = useState<IPost[] | []>([])
    let [currPosts, setCurrPosts] = useState([...userPosts])
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
        if(userPosts.length === 0) {
            dispatch(fetchMyPosts({_id:auth.userId, postLength:currPosts.length, token:auth.userToken}))
               .then((response:any) => setPosts(response.payload.posts))
        } else {
            setPosts(userPosts)
        }
    }, [])

    
    function appendImage(target:EventTarget) {
        postImage(target,false/*album*/,false/*postId*/).then(res => {//saves image to 'imgbb.com' server
            dispatch(uploadImage({image:{...res, user: auth.userInfo._id,description:""}, token:auth.userToken}))//saves information about image to mongodb 
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
        // let imgs = imagesToAppend.map(img => img._id)
        const post = {text: textArea.current.value, author:auth.userInfo._id,images: [...imagesToAppend]}
        dispatch(createPost({post, token:auth.userToken}))
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
    // function filterTags(strTags:string) {
    //     let result = strTags.split(' ')
    //     for (let i = 0; i < result.length-1; i++) {//gets rib of repeating tags
    //         for (let j = i; j < result.length-1; j++) {
    //             if(result[i] === result[j+1]) result[i] = ''
    //         }    
    //     }
    //     return result.filter(str => str.length > 0)
    // }
    // function addTags(e:Event) {
    //     e.preventDefault();
    //     if(tags.current) tags.current.style.display = 'flex';
    // } 
    return (
        <div>
            <div className={classes.makePost} onMouseLeave={hideTools} onMouseEnter={showTools}>
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
                   {/* <Append className={classes.appendIcon}/> */}
                   {/* <a href='' className={classes.tag}> <Tags className={classes.tagsIcon} onClick={addTags}/></a> */}
                   {/* <div>
                      <input ref={tags} className={classes.tagsInput} onFocus={_ => setFocus(true)} onBlur={_ => setFocus(false)} placeholder='firstTag secondTag...'/>
                   </div> */}
                </div>
            </div>
            <div className={classes.postsList}>{
                posts.map((post,id) => {
                    return <Post key={post._id} auth={auth.userInfo} 
                    setCurrPosts={setCurrPosts}
                    setSliderTrue={setSliderTrue}
                    token={auth.userToken} 
                    setCurrPictureId={setCurrPictureId} 
                    currPictureId={currPictureId} 
                    avatarUrl={auth.userInfo.avatarUrl} 
                    postId={post._id} 
                    views={post.viewCount} 
                    share={post.shares} 
                    likes={post.likes} 
                    comments={post.comments} 
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