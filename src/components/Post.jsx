import { ReactComponent as Delete } from '../assets/icons/delete.svg'
import { ReactComponent as Change } from '../assets/icons/change.svg'
import { ReactComponent as Share } from '../assets/icons/share.svg'
import { ReactComponent as Like } from '../assets/icons/like.svg'
import { ReactComponent as Views } from '../assets/icons/views.svg'
import { ReactComponent as Comments } from '../assets/icons/comments.svg'

import classes from '../styles/post.module.css'
import Slider from './Slider'
import { useEffect, useState } from 'react'
import MessageTool from './MessageTool'
import axios from 'axios'
export default function Post(props) {
  let [sliderTrue, setSliderTrue] = useState(false)
  let [currPictureId, setCurrPictureId] = useState(false)
  let [commentsTrue, setCommentsTrue] = useState(false)
  let [comment, setComment] = useState(null)
  useEffect(_ => {
    if(comment!==null) {
      axios.post('http://localhost:3001/posts/comments')
    }
  },[comment])


    return (
        <div className={classes.post}>
        <div className={classes.postHeader}>
          <div><img className={classes.profileCircle} ></img></div>
          <div className={classes.date}>published on {props.date} {props.year} at {props.time}</div>
          <div className={classes.postTools}>
            <Delete className={classes.icon}/>
            <Change className={classes.icon}/>
          </div>
        </div>
        <div className={classes.text}>{props.text}</div>
          <div className={classes.images}>
            {props.images.map(img => {
              return <div className={classes.imgWrapper}><img data-id={img._id} className={classes.image} onClick={e => {
                setCurrPictureId(e.target.dataset.id)
                setSliderTrue(true)
              }} src={img.imageURL}></img></div>
            })
          }
          </div>
          <div className={classes.tools}>
          <div className={classes.tool}>
               <p>{props.views}</p>
               <Views className={classes.view}/>
              </div>
            <div className={classes.rightBlock}>
              <div className={classes.tool}>
                <p>{props.commentsNum}</p>
                <Comments className={classes.icon} onClick={_ => setCommentsTrue(prev => !prev)}/>
              </div>
              <div className={classes.tool}>
                <p>{props.likes}</p>
                <Like className={classes.icon}/>
              </div>
              <div className={classes.tool}>
                <p>{props.share}</p>
                <Share className={classes.icon}/>
              </div>
            </div>
          </div>
          <div className={commentsTrue? classes.comments : classes.commentsHide}>
            {props.comments.length>0 & props.comments.map((comment, id) => {
              return ( 
              <div key={id}>
                <Comment autherPicture={comment.autherPicture} autherName={comment.autherName} likes={comment.likes} comment={comment.comment} time={comment.time}/>
                <div>
                  <a href="#">Show replies</a>
                  <div className={classes.replies}>
                    {comment.replies.map((reply,id) => {
                      return <Comment key={id} autherPicture={reply.autherPicture} autherName={reply.autherName} likes={reply.likes} comment={reply.comment} time={reply.time}/>
                    })}
                  </div>
                </div>
              </div>)
            })}
            <MessageTool uploadMessage={setComment}/>
          </div>
          <Slider sliderTrue={sliderTrue} setSliderTrue={setSliderTrue} currPictureId={currPictureId}/>
        </div>
    )
}

function Comment(props) {
  return (
    <div className={classes.comment}>
    <div className={classes.commentMain}>
    <img className={classes.profilePicture} src={props.autherPicture}></img>
     <div className={classes.commentBody}>
       <h3>{props.autherName}</h3>
       <p>{props.comment}</p>
       <div className={classes.commentInf}>
         <p className={classes.time}>{props.time}</p>
         <a href='#'>Reply</a>
       </div>
     </div>
     <div className={classes.likes}>
      <Like/>
      <p>{props.likes}</p>
     </div>
    </div>

  </div>
  )
}

