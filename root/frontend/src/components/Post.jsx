import { ReactComponent as Delete } from '../assets/icons/delete.svg'
import { ReactComponent as Menu } from '../assets/icons/dots.svg'
import { ReactComponent as Share } from '../assets/icons/share.svg'
import { ReactComponent as Like } from '../assets/icons/like.svg'
import { ReactComponent as Views } from '../assets/icons/views.svg'
import { ReactComponent as Comments } from '../assets/icons/comments.svg'

import classes from '../styles/post.module.css'
import Slider from './Slider'
import { useEffect, useState } from 'react'
import MessageTool from './MessageTool'
import axios from 'axios'
import trimTime from '../helper_functions/trimTime'
import { postComment } from '../features/postSlice'

export default function Post(props) {
  let [sliderTrue, setSliderTrue] = useState(false)
  // let [currPictureId, setCurrPictureId] = useState(false)
  let [commentsTrue, setCommentsTrue] = useState(false)
  let [comment, setComment] = useState(null)
  let [showMenu, setShowMenu] = useState(false)
  let alreadySmashedLike;
  alreadySmashedLike = props.likes? props.likes.filter(user => user === props.auth._id)[0] : []

  useEffect(_ => {
    if(comment!==null) {
      axios.post(`http://localhost:3001/posts/comments/${props.postId}`,
      {text: comment, user:props.auth._id, authorName:props.auth.fullName, authorPicture:props.auth.avatarUrl, post:props.postId})
    }
  },[comment])

  function deletePost() {
    axios.delete(`http://localhost:3001/posts/${props.postId}`,
    {headers: {'Content-Type': 'application/json',"Authorization": `Bearer ${props.auth.token}`}}).then(res => {
      props.update(false)
    })
  }
  function smashLike() {
    axios.post(`http://localhost:3001/posts/like`, {userId: props.auth._id, postId:props.postId}).then(res => {
      props.update(false)
    })
  }
  function removeLike() {
    axios.post(`http://localhost:3001/posts/removeLike`, {userId: props.auth._id, postId:props.postId}).then(res => {
      props.update(false)
    })
  }

    return (
        <div className={classes.post}>
        <div className={classes.postHeader}>
          <div><img className={classes.profileCircle} ></img></div>
          <div className={classes.date}>{`published on ${props.date}`}</div>
          <div className={classes.postTools}>
            <Menu className={classes.postMenu} onMouseEnter={_ => setShowMenu(true)} onMouseLeave={_ => setShowMenu(false)}/>
            <div className={showMenu? classes.menuTools : classes.menuToolsHide} onMouseEnter={_ => setShowMenu(true)} onMouseLeave={_ => setShowMenu(false)}>
              <a onClick={deletePost}>Delete</a>
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
                <p>{alreadySmashedLike==undefined? 0 : [alreadySmashedLike].length}</p>
                <Like className={alreadySmashedLike? classes.iconBlue : classes.icon} onClick={alreadySmashedLike? removeLike : smashLike}/>
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
                <Comment autherPicture={comment.autherPicture} autherName={comment.autherName} likes={comment.likes} comment={comment.comment} text={comment.text} time={trimTime(comment)}/>
                { comment.replies.length>0 & ( <div className={classes.repliesWrapper}>
                  <a href="#">Show replies</a>
                  <div className={classes.replies}>
                    {comment.replies.map((reply,id) => {
                      return <Comment key={id} autherPicture={reply.autherPicture} autherName={reply.autherName} likes={reply.likes} comment={reply.text} time={trimTime(reply)}/>
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
        <img className={classes.profilePicture} src={props.autherPicture}></img>
        <div className={classes.commentBody}>
          <h5 className={classes.autherName}>{props.autherName}</h5>
          <p className={classes.text}>{props.text}</p>
          <div className={classes.commentInf}>
            <p className={classes.time}>{props.time}</p>
            <a href='#' className={classes.reply}>Reply</a>
          </div>
        </div>
      </div>
      <div className={classes.postRightside}>
        <p className={classes.likesNum}>{props.likes}</p>
        <Like className={classes.likesIcon}/>
      </div>
    </div>
  )
}

