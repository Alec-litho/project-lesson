//-----------------------------Icons-----------------------------//
import { ReactComponent as Delete } from '../assets/icons/delete.tsx';
import { ReactComponent as Menu } from '../assets/icons/dots.svg';
import { ReactComponent as Share } from '../assets/icons/share.svg';
import { ReactComponent as Like } from '../assets/icons/like.svg';
import { ReactComponent as Views } from '../assets/icons/views.svg';
import { ReactComponent as Comments } from '../assets/icons/comments.svg';
import {ReactComponent as Cross} from '../assets/icons/cross.svg';
import { ReactComponent as Append } from '../assets/icons/append.svg';
//-----------------------------Icons-----------------------------//
import classes from '../styles/post.module.css';
import Slider from './Slider';
import { useEffect, useRef, useState } from 'react';
import MessageTool from './MessageTool';
import trimTime from '../helper_functions/trimTime';
import { useDispatch, useSelector } from 'react-redux';
import { deletePost, likePost, likePostComment, removeLike} from '../features/postSlice';
import { useNavigate } from "react-router-dom";


export default function Post({author, visitor, post, setCurrPictureId, setSliderTrue, setCurrPosts, token, removeFromRecommendations}=props) {
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const auth = useSelector(state => state.auth);
  // let [sliderTrue, setSliderTrue] = useState(false);
  let [editPost, setEditPost] = useState(false);
  let [replyToComment, setReplyToComment] = useState(false);
  let [showCross, setShowCross] = useState(false);
  let [textArea, setTextArea] = useState(post.text);
  // let [currPictureId, setCurrPictureId] = useState(false);
  let [showMenu, setShowMenu] = useState(false);
  let [postLike, setPostLike] = useState(post.likes.filter(user => user === visitor._id));
  let postY = useRef(null);
  let [userReplyTo, setUserReplyTo] = useState({commentId:null, name:null, cordY:null});/*person another user wants to reply to*/
  let [comments, setComment] = useState(post.comments);
  let [commentLikes, setCommentLike] = useState(countCommentsLikes(post.comments))
  let [isCommenting, setCommentStatus] = useState(false)
  let [showReplies, setShowReplies] = useState(false)
  let messageToolCordY = useRef()

// console.log("visitor -->",visitor,"author -->", author, comments);
console.log(commentLikes);
  useEffect(_ => {
    // if(comment!==null) {
      // axios.post(`http://localhost:3001/posts/comments/${props.postId}`,
      // {text: comment, user:props.auth._id, authorName:props.auth.fullName, authorPicture:props.auth.avatarUrl, post:props.post._id})
    // }
    setCurrPosts((prevState) => [...prevState, {postId:post._id, watched:false, positionY:postY.current.getBoundingClientRect().top}])
  },[/*alreadySmashedLike*/userReplyTo])
  function countCommentsLikes(comment) {//counts likes that were put by visitor
    console.log(comment);
    return comment.map(comment => {
      if(comment.replies.length>0){
        return [comment.likes.indexOf(visitor._id)===-1?[]:[comment._id],...countCommentsLikes(comment.replies) ]
      } else {
        return comment.likes.indexOf(visitor._id)===-1?[]:[comment._id]
      }
    })
  }
  function likePost() {
    setPostLike([author._id]);
    dispatch(likePost({id:post._id, userId:author._id}));
  }
  function removeLike() {
    setPostLike([])
    dispatch(removeLike({id:post._id, userId:author._id}))
  }
  function likeComment(commentId) {
    setCommentLike(prev => [...prev,commentId])
    dispatch(likePostComment({commentId, userId:visitor._id}))
  }
  function reply({e}) {
    e.preventDefault();
    const commentId = e.target.parentNode.parentNode.parentNode.parentNode.parentNode.dataset.id;
    console.log(e, commentId);
    [...e.target.parentNode.parentNode.childNodes].forEach(node => {
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
          <img src={author.avatarUrl} className={classes.profileCircle} ></img>
          <div className={classes.date}>{`published on ${trimTime(post.createdAt)}`}</div>
          <div className={classes.postTools}>
            <Menu className={classes.postMenu} onMouseEnter={_ => setShowMenu(true)} onMouseLeave={_ => setShowMenu(false)}/>
            <div className={showMenu? classes.menuTools : classes.menuToolsHide} onMouseEnter={_ => setShowMenu(true)} onMouseLeave={_ => setShowMenu(false)}>
              {auth.userId === author._id?
              <>
                <a onClick={() => dispatch(deletePost({postId:post._id, token}))}>Delete</a>
                <a onClick={() => setEditPost(true)}>Edit</a>
                <a>Report</a>
              </> :
              <>
                <a onClick={() => console.log(report)}>Report</a>
                <a onClick={() => removeFromRecommendations(post._id)}>Hide from recom...</a>
              </>
              }
             
            </div>
          </div>
        </div>
        {editPost? <PostBodyEdit images={post.images} textArea={textArea} setTextArea={setTextArea} setCurrPictureId={setCurrPictureId} setEditPost={setEditPost} setSliderTrue={setSliderTrue} setShowCross={setShowCross} showCross={showCross}/> :
                   <PostBody images={post.images} text={post.text} setCurrPictureId={setCurrPictureId} setSliderTrue={setSliderTrue}/>}
          <div className={classes.tools}>
          <div className={classes.rightBlock}>
              <div className={classes.tool}>
                <p>{postLike.length>0? [postLike].length : ""}</p>
                <Like className={postLike.length>0? classes.iconBlue : classes.icon} onClick={postLike.length>0? removeLike : likePost}/>
              </div>
              <div className={classes.tool}>
                <p>{comments.length===0? "" : post.comments.length}</p>
                <Comments className={classes.icon} onClick={_ => setCommentStatus(prev => !prev)}/>
              </div>
              <div className={classes.tool}>
                <p>{post.share}</p>
                <Share className={classes.icon}/>
              </div>
          </div>
          <div className={classes.tool}>
               <p>{post.views}</p>
               <Views className={classes.icon}/>
          </div>
          </div>
          <div className={isCommenting? classes.comments : comments.length>0 ? classes.commentsShowOne : classes.commentsHideAll}>
            {comments.map((comment, id) => {
              console.log(comment);
              const replies = Array.isArray(comment.replies)? comment.replies : [comment.replies]//mongoose returns object instead of array when populating 1 doc
              return ( 
              <div key={id} className={classes.commentWrapper}>
                <Comment author={comment.user} visitor={visitor} reply={reply} commentId={comment._id} likes={comment.likes} text={comment.text} 
                time={trimTime(comment.createdAt)} navigate={navigate} replies={replies} showReplies={showReplies} setShowReplies={setShowReplies}
                likeComment={likeComment}
                ></Comment>
              </div>)
            })}
          </div>
          {isCommenting && <MessageTool messageToolCordY={messageToolCordY} type={replyToComment? 'reply' : 'comment'} 
          setReplyToComment={setReplyToComment} userReplyTo={userReplyTo}/*in case user replying*/ postId={post._id} setComment={setComment}/>}
        </div>
    )
}

function Comment({author,visitor,commentId,userReplyTo,text,time,reply,likes,navigate,showReplies,setShowReplies,replies,likeComment}=props) {
  console.log(author,visitor);
  return (
    <div data-id={commentId} className={classes.commentComponent}>
      <div className={classes.comment}>
        <div className={classes.postLeftside}>
          <img className={classes.profilePicture} src={author.avatarUrl} onClick={()=>navigate(`/${author._id}`)}></img>
          <div className={classes.commentBody}>
            <div className={classes.commentHeader}>
               <h5 className={author._id===visitor._id?classes.myName:classes.authorName}>{author.fullName}</h5>
               <p className={classes.time}>{time}</p>
            </div>
            <p className={classes.text}><span style={{color:"rgb(53, 121, 199);"}}>{userReplyTo} </span>{text}</p>
            <div className={classes.commentInf}>
              <a href='#' className={classes.reply} onClick={(e) => reply({e})}>reply</a>
              <div className={classes.commentReplies}>
               {replies.length>0 && 
                  <>
                     <div>{replies.map((reply,id) => {if(id!==3) return <img className={classes.replyImgCircle} src={reply.user.avatarUrl}></img>})}</div>
                     <a onClick={() => setShowReplies(prev => !prev)}>{showReplies? "hide" : "show"}</a>
                  </>
                }
              </div>
            </div>
          </div>
        </div>
        <div className={classes.postRightside}>
          <p className={classes.likesNum}>{likes===0? "" : author.likes}</p>
          <Like className={classes.commentLike} onClick={() => likeComment(commentId)}/>
        </div>
      </div>
      {replies?.length>0 && <CommentReplies showReplies={showReplies} replies={replies} reply={reply} visitor={visitor} navigate={navigate} likeComment={likeComment}/>}
    </div>
  )
}
function CommentReplies({showReplies,replies,visitor,navigate,likeComment,reply}=props) {
  return (
    <div className={classes.repliesWrapper}>
      {showReplies && (
      <div className={classes.replies}>
        {replies.map((reply,id) => {
          return <Comment key={id} author={reply.user}  visitor={visitor}  dataset={reply._id} likes={reply.likes} userReplyTo={reply.user.fullName} 
          time={trimTime(reply.createdAt)} text={reply.text} navigate={navigate} likeComment={likeComment} reply={reply}
          />
        })}
      </div>)}
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