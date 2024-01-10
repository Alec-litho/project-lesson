import { ReactComponent as Delete } from '../assets/icons/delete.tsx';
import { ReactComponent as Menu } from '../assets/icons/dots.svg';
import { ReactComponent as Share } from '../assets/icons/share.svg';
import { ReactComponent as Like } from '../assets/icons/like.svg';
import { ReactComponent as Views } from '../assets/icons/views.svg';
import { ReactComponent as Comments } from '../assets/icons/comments.svg';
import {ReactComponent as Cross} from '../assets/icons/cross.svg';
import { ReactComponent as Append } from '../assets/icons/append.svg';

import classes from '../styles/post.module.css';
import Slider from './Slider';
import { useEffect, useRef, useState } from 'react';
import MessageTool from './MessageTool';
import axios from 'axios';
import trimTime from '../helper_functions/trimTime';
import { useDispatch } from 'react-redux';
import { deletePost, likePost } from '../features/postSlice';


export default function Post({auth,avatarUrl,date,share,setCurrPictureId,setSliderTrue,setCurrPosts,text,token,likes,postId,images,views,postComments}=props) {
  let dispatch = useDispatch();
  // let [sliderTrue, setSliderTrue] = useState(false);
  let [editPost, setEditPost] = useState(false);
  let [replyToComment, setReplyToComment] = useState(false);
  let [showCross, setShowCross] = useState(false);
  let [textArea, setTextArea] = useState(text);
  // let [currPictureId, setCurrPictureId] = useState(false);
  let [showMenu, setShowMenu] = useState(false);
  let [alreadySmashedLike, setAlreadySmashedLike] = useState(likes.filter(user => user === auth._id));
  let postY = useRef(null);
  let [userReplyTo, setUserReplyTo] = useState({commentId:null, name:null, cordY:null});/*person another user wants to reply to*/
  let [comments, setComment] = useState(postComments);
  let [isCommenting, setCommentStatus] = useState(false)
  let messageToolCordY = useRef()

console.log(comments);
  useEffect(_ => {
    // if(comment!==null) {
      // axios.post(`http://localhost:3001/posts/comments/${props.postId}`,
      // {text: comment, user:props.auth._id, authorName:props.auth.fullName, authorPicture:props.auth.avatarUrl, post:props.postId})
    // }
    console.log(postY);
    setCurrPosts((prevState) => [...prevState, {postId, watched:false, positionY:postY.current.getBoundingClientRect().top}])
  },[/*alreadySmashedLike*/])

  function smashLike() {
    setAlreadySmashedLike([auth._id]);
    console.log(postId);
    dispatch(likePost({id:postId, userId:auth._id}));
  }
  function removeLike() {
    setAlreadySmashedLike([])
    console.log('removed');
    // axios.post(`http://localhost:3001/posts/removeLike`, {userId: auth._id, postId}).then(res => {
    // })
  }
  function reply(data) {
    data.e.preventDefault();
    const commentId = data.e.target.parentNode.parentNode.parentNode.parentNode.dataset.id;
    console.log(commentId);
    [...data.e.target.parentNode.parentNode.childNodes].forEach(node => {
      if(node.nodeName == 'H5') {//find h5 tag and use its inner text to reply, later this name will be checked on the server
        console.log(node.offsetTop);
        setUserReplyTo({commentId, name:node.innerText, cordY:node.offsetTop});
      }
    });
    window.scrollTo({top:messageToolCordY.current.offsetTop-400, behavior:'smooth'})
    setReplyToComment(replyToComment = true)
  }
    return (
        <div className={classes.post} ref={postY}>
        <div className={classes.postHeader}>
          <img src={avatarUrl} className={classes.profileCircle} ></img>
          <div className={classes.date}>{`published on ${date}`}</div>
          <div className={classes.postTools}>
            <Menu className={classes.postMenu} onMouseEnter={_ => setShowMenu(true)} onMouseLeave={_ => setShowMenu(false)}/>
            <div className={showMenu? classes.menuTools : classes.menuToolsHide} onMouseEnter={_ => setShowMenu(true)} onMouseLeave={_ => setShowMenu(false)}>
              <a onClick={() => dispatch(deletePost({postId, token}))}>Delete</a>
              <a onClick={() => setEditPost(true)}>Edit</a>
              <a>Report</a>
            </div>
          </div>
        </div>
        {editPost? <PostBodyEdit images={images} textArea={textArea} setTextArea={setTextArea} setCurrPictureId={setCurrPictureId} setEditPost={setEditPost} setSliderTrue={setSliderTrue} setShowCross={setShowCross} showCross={showCross}/> :
                   <PostBody images={images} text={text} setCurrPictureId={setCurrPictureId} setSliderTrue={setSliderTrue}/>
        }
          <div className={classes.tools}>
          <div className={classes.rightBlock}>
              <div className={classes.tool}>
                <p>{alreadySmashedLike.length>0? [alreadySmashedLike].length : ""}</p>
                <Like className={alreadySmashedLike.length>0? classes.iconBlue : classes.icon} onClick={alreadySmashedLike.length>0? removeLike : smashLike}/>
              </div>
              <div className={classes.tool}>
                <p>{comments.length===0? "" : comments.length}</p>
                <Comments className={classes.icon} onClick={_ => setCommentStatus(prev => !prev)}/>
              </div>
              <div className={classes.tool}>
                <p>{share}</p>
                <Share className={classes.icon}/>
              </div>
          </div>
          <div className={classes.tool}>
               <p>{views}</p>
               <Views className={classes.icon}/>
          </div>
          </div>
          <div className={isCommenting? classes.comments : comments.length>0 ? classes.commentsShowOne : classes.commentsHideAll}>
            {comments.map((comment, id) => {

              const replies = Array.isArray(comment.replies)? comment.replies : [comment.replies]//mongoose returns object instead of array when populating 1 doc
              return ( 
              <div key={id} className={classes.commentWrapper}>
                <Comment reply={reply} dataset={comment._id} authorPicture={comment.user.avatarUrl} authorName={comment.user.fullName} likes={comment.likes} text={comment.text} time={trimTime(comment.createdAt)}/>
                {replies.length>0 && ( 
                <div className={classes.repliesWrapper}>
                  <a >Show replies</a>
                  <div className={classes.replies}>
                    {replies.map((reply,id) => {
                      return <Comment key={id} authorPicture={reply.authorPicture} authorName={reply.authorName} likes={reply.likes} comment={reply.text} time={trimTime(reply)} text={comment.text}/>
                    })}
                  </div>
                </div>)}
              </div>)
            })}
    
          </div>
          {isCommenting && <MessageTool messageToolCordY={messageToolCordY} type={replyToComment? 'reply' : 'comment'} setReplyToComment={setReplyToComment} userReplyTo={userReplyTo}/*in case user replying*/ postId={postId} setComment={setComment}/>}
        </div>
    )
}

function Comment(props) {
  return (
    <div data-id={props.dataset} className={classes.comment}>
      <div className={classes.postLeftside}>
        <img className={classes.profilePicture} src={props.authorPicture}></img>
        <div className={classes.commentBody}>
          <h5 className={classes.autherName}>{props.authorName}</h5>
          <p className={classes.text}>{props.text}</p>
          <div className={classes.commentInf}>
            <p className={classes.time}>{props.time}</p>
            <a href='#' className={classes.reply} onClick={(e) => props.reply({e})}>Reply</a>
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

function PostBody({images, text, setCurrPictureId, setSliderTrue}) {
  return (
    <div className={classes.postBody}>
    <div className={classes.text}>{text}</div>
    <div className={classes.images}>
      {images.map((img, id) => {
          return <div key={id} className={classes.imgWrapper}><img data-id={img._id} className={classes.image} onClick={e => {
            setCurrPictureId(e.target.dataset.id)
            setSliderTrue(true)
          }} src={img.imageURL}></img></div>
        })
      }
    </div>
    </div>
  )
}
function PostBodyEdit({images, textArea, setTextArea, setCurrPictureId, setEditPost, setSliderTrue, setShowCross, showCross}) {
  let textToChange = '';
  console.log(showCross);
  return <div className={classes.postEdit}>
    <textarea defaultValue={textArea? textArea:'enter text'} onChange={(e) => textToChange = e.target.value}></textarea>
    <div className={classes.images}>
      {images.map((img, id) => {
          return <div key={id} className={classes.imgWrapper} onMouseEnter={()=>setShowCross(true)} onMouseLeave={()=>setShowCross(false)}>
            <Cross className={showCross? classes.discardAppend : classes.discardAppendHide} onClick={() => console.log('delete image request')}/>
            <img data-id={img._id} className={classes.image} onClick={e => {
            setCurrPictureId(e.target.dataset.id)
            setSliderTrue(true)
          }} src={img.imageURL}></img>
          </div>
        })
      }
    </div>
    <div className={classes.editPostMenu}>
      <Append className={classes.icon}/>
      <button className={classes.editDiscard} onClick={() => setEditPost(false)}>Discard</button>
      <button className={classes.editFinish} onClick={() => {console.log('sent to DB', textToChange); setEditPost(false)}}>Finish</button>
    </div>
    </div>
  
}