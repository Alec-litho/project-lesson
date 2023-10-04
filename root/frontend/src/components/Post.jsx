import { ReactComponent as Delete } from '../assets/icons/delete.svg'
import { ReactComponent as Menu } from '../assets/icons/dots.svg'
import { ReactComponent as Share } from '../assets/icons/share.svg'
import { ReactComponent as Like } from '../assets/icons/like.svg'
import { ReactComponent as Views } from '../assets/icons/views.svg'
import { ReactComponent as Comments } from '../assets/icons/comments.svg'

import classes from '../styles/post.module.css'
import Slider from './Slider'
import { useEffect, useRef, useState } from 'react'
import MessageTool from './MessageTool'
import axios from 'axios'
import trimTime from '../helper_functions/trimTime'
import { postComment } from '../features/postSlice'
import { useDispatch } from 'react-redux'
import { deletePost } from '../features/postSlice'

export default function Post(props) {
  let dispatch = useDispatch();
  let [sliderTrue, setSliderTrue] = useState(false)
  // let [currPictureId, setCurrPictureId] = useState(false)
  let [commentsTrue, setCommentsTrue] = useState(false)
  // let [comment, setComment] = useState(null)
  let [showMenu, setShowMenu] = useState(false)
  let [alreadySmashedLike, setAlreadySmashedLike] = useState(props.likes.filter(user => user === props.auth._id))
  let postY = useRef(null)

  useEffect(_ => {
    // if(comment!==null) {
      // axios.post(`http://localhost:3001/posts/comments/${props.postId}`,
      // {text: comment, user:props.auth._id, authorName:props.auth.fullName, authorPicture:props.auth.avatarUrl, post:props.postId})
    // }
    console.log(postY);
    props.setCurrPosts((prevState) => [...prevState, {postId:props.postId, watched:false, positionY:postY.current.getBoundingClientRect().top}])
  },[alreadySmashedLike])

  function smashLike() {
    setAlreadySmashedLike([props.auth._id])
    axios.post(`http://localhost:3001/posts/like`, {userId: props.auth._id, postId:props.postId}).then(res => {
      props.update(false)
    })
  }
  function removeLike() {
    setAlreadySmashedLike([])
    axios.post(`http://localhost:3001/posts/removeLike`, {userId: props.auth._id, postId:props.postId}).then(res => {
      props.update(false)
    })
  }
  console.log(alreadySmashedLike);
    return (
        <div className={classes.post} ref={postY}>
        <div className={classes.postHeader}>
          <img src={props.avatarUrl} className={classes.profileCircle} ></img>
          <div className={classes.date}>{`published on ${props.date}`}</div>
          <div className={classes.postTools}>
            <Menu className={classes.postMenu} onMouseEnter={_ => setShowMenu(true)} onMouseLeave={_ => setShowMenu(false)}/>
            <div className={showMenu? classes.menuTools : classes.menuToolsHide} onMouseEnter={_ => setShowMenu(true)} onMouseLeave={_ => setShowMenu(false)}>
              <a onClick={() => dispatch(deletePost({postId:props.postId, token:props.token}))}>Delete</a>
              <a>Edit</a>
              <a>Report</a>
            </div>
          </div>
        </div>
        <div className={classes.text}>{props.text}</div>
          <div className={classes.images}>
            {props.images.map((img, id) => {
              return <div key={id} className={classes.imgWrapper}><img data-id={img._id} className={classes.image} onClick={e => {
                props.setCurrPictureId(e.target.dataset.id)
                setSliderTrue(true)
              }} src={img.imageURL}></img></div>
            })
          }
          </div>
          <div className={classes.tools}>
          <div className={classes.tool}>
               <p>{props.views}</p>
               <Views className={classes.views}/>
              </div>
            <div className={classes.rightBlock}>
              <div className={classes.tool}>
                <p>{props.comments.length}</p>
                <Comments className={classes.icon} onClick={_ => setCommentsTrue(prev => !prev)}/>
              </div>
              <div className={classes.tool}>
                <p>{alreadySmashedLike.length>0? [alreadySmashedLike].length : 0}</p>
                <Like className={alreadySmashedLike.length>0? classes.iconBlue : classes.icon} onClick={alreadySmashedLike.length>0? removeLike : smashLike}/>
              </div>
              <div className={classes.tool}>
                <p>{props.share}</p>
                <Share className={classes.icon}/>
              </div>
            </div>
          </div>
          <div className={commentsTrue? classes.comments : props.comments.length>0 ? classes.commentsShowOne : classes.commentsHideAll}>
            {props.comments.map((comment, id) => {
              return ( 
              <div key={id} className={classes.commentWrapper}>
                <Comment authorPicture={comment.authorPicture} authorName={comment.authorName} likes={comment.likes} comment={comment.comment} text={comment.text} time={trimTime(comment.createdAt)}/>
                { comment.replies.length>0 && ( <div className={classes.repliesWrapper}>
                  <a href="#">Show replies</a>
                  <div className={classes.replies}>
                    {comment.replies.map((reply,id) => {
                      return <Comment key={id} authorPicture={reply.authorPicture} authorName={reply.authorName} likes={reply.likes} comment={reply.text} time={trimTime(reply)}/>
                    })}
                  </div>
                </div>)}
              </div>)
            })}
    
          </div>
          <MessageTool type={'comment'} postId={props.postId}/>
          <Slider sliderTrue={sliderTrue} setSliderTrue={setSliderTrue} currPictureId={props.currPictureId} setCurrPictureId={props.setCurrPictureId}/>
        </div>
    )
}

function Comment(props) {
  return (
    <div className={classes.comment}>
      <div className={classes.postLeftside}>
        <img className={classes.profilePicture} src={props.authorPicture}></img>
        <div className={classes.commentBody}>
          <h5 className={classes.autherName}>{props.authorName}</h5>
          <p className={classes.text}>{props.text}</p>
          <div className={classes.commentInf}>
            <p className={classes.time}>{props.time}</p>
            <a href='#' className={classes.reply}>Reply</a>
          </div>
        </div>
      </div>
      <div className={classes.postRightside}>
        <p className={classes.likesNum}>{props.likes}</p>
        <Like className={classes.commentLike}/>
      </div>
    </div>
  )
}

