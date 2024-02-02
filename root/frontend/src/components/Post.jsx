//-----------------------------Icons-----------------------------//
import { ReactComponent as Share } from '../assets/icons/share.svg';
import { ReactComponent as Like } from '../assets/icons/like.svg';
import { ReactComponent as Views } from '../assets/icons/views.svg';
import { ReactComponent as Comments } from '../assets/icons/comments.svg';
import {ReactComponent as Cross} from '../assets/icons/cross.svg';
import { ReactComponent as Append } from '../assets/icons/append.svg';
//-----------------------------Icons-----------------------------//
import classes from '../styles/post.module.css';
import { useEffect, useRef, useState } from 'react';
import MessageTool from './MessageTool';
import ComponentMenu from './ComponentMenu'
import trimTime from '../helper_functions/trimTime';
import { useDispatch, useSelector } from 'react-redux';
import { deletePostReducer, likePostComment, removeLikeCommentReducer, removeLikePost, uploadLikePost, deleteCommentReducer} from '../features/postSlice';
import { useNavigate } from "react-router-dom";
import countComments from '../helper_functions/countComments'

export default function Post({author, visitor, post, setCurrPictureId, setSliderTrue, setCurrPosts, token, removeFromRecommendations, setPosts}=props) {
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const auth = useSelector(state => state.auth);
  let [editPost, setEditPost] = useState(false);
  let [editComment, setEditComment] = useState(false);
  let [replyToComment, setReplyToComment] = useState(false);
  let [showCross, setShowCross] = useState(false);
  let [textArea, setTextArea] = useState(post.text);
  let [postLikes, setPostLikes] = useState(post.likes);
  let [userReplyTo, setUserReplyTo] = useState({commentId:null, name:null, cordY:null});/*person another user wants to reply to*/
  let [comments, setComments] = useState([]);
  let [isCommenting, setCommentStatus] = useState(false)
  let [showReplies, setShowReplies] = useState([])
  let messageToolCordY = useRef()
  let commentAuthorH5 = useRef()
  let postY = useRef(null);
  let [commentsLeng,setCommentsLeng] = useState()
//таких постов может быть и 100, насколько это будет тяжело со всеми фунциями и тп
  useEffect(_ => {

    setComments(post.comments)
    setCommentsLeng(countComments(post.comments))
    setCurrPosts((prevState) => [...prevState, {postId:post._id, watched:false, positionY:postY.current.offsetTop}])
  },[])

  function deletePost(componentId){
    setPosts(prev => prev.filter(el => el._id!==post._id))
    dispatch(deletePostReducer({postId:componentId, token}))
  }
  function deleteComment(componentId) {dispatch(deleteCommentReducer({commentId:componentId, token}))}
  function likePost() {
    setPostLikes(prev => [...prev,auth.userId]);
    dispatch(uploadLikePost({id:post._id, userId:visitor._id}));
  }
  function removeLike() {
    const likes = postLikes.filter(userId => userId!==auth.userId)
    setPostLikes(likes)
    dispatch(removeLikePost({id:post._id, userId:author._id}))
  }
  function likeComment(e,comment) {
    e.target.style.fill = "rgb(87, 149, 230)"
    dispatch(likePostComment({commentId:comment._id, userId:auth.userId}))
  }
  function removeLikeComment(e,comment) {
    e.target.style.fill = "rgb(122, 122, 122)";
    dispatch(removeLikeCommentReducer({commentId:comment._id, userId:visitor._id}))
  }
  function reply({e}) {
    e.preventDefault();
    const commentId = e.target.parentNode.parentNode.parentNode.parentNode.parentNode.dataset.id;
    const h5 = commentAuthorH5.current//<h5></h5>
    setUserReplyTo({commentId, name:h5.innerText, cordY:h5.offsetTop});
    window.scrollTo({top:messageToolCordY.current.offsetTop-400, behavior:'smooth'})
    setReplyToComment(replyToComment = true)
  }
  function viewUser(comment) {
    setPosts(null)
    navigate(`/user/${comment.user._id}`);
    window.scrollTo(0, 0)
    setCurrPosts([])
  }
  
    return (
        <div className={classes.post} ref={postY}>
        <div className={classes.postHeader}>
          <img src={author.avatarUrl} className={classes.profileCircle} ></img>
          <div className={classes.date}>{`published on ${trimTime(post.createdAt)}`}</div>
          <div className={classes.postTools}>
            <ComponentMenu type={"post"} visitor={visitor} author={author} deletePost={deletePost}
            setEditPost={setEditPost} post={post}
            />
          </div>
        </div>
        {editPost? <PostBodyEdit images={post.images} textArea={textArea} setTextArea={setTextArea} setCurrPictureId={setCurrPictureId} setEditPost={setEditPost} setSliderTrue={setSliderTrue} setShowCross={setShowCross} showCross={showCross}/> :
                   <PostBody images={post.images} text={post.text} setCurrPictureId={setCurrPictureId} setSliderTrue={setSliderTrue}/>}
          <div className={classes.tools}>
          <div className={classes.rightBlock}>
              <div className={classes.tool}>
                <p>{postLikes.length>0? postLikes.length : ""}</p>
                <Like className={postLikes.indexOf(auth.userId)!==-1? classes.iconBlue : classes.icon} onClick={postLikes.indexOf(auth.userId)!==-1? removeLike : likePost}/>
              </div>
              <div className={classes.tool}>
                <p>{comments.length===0? "" : commentsLeng}</p>
                <Comments className={classes.icon} onClick={_ => setCommentStatus(prev => !prev)}/>
              </div>
              <div className={classes.tool}>
                <p>{post.share}</p>
                <Share className={classes.icon}/>
              </div>
          </div>
          <div className={classes.tool}>
               <p>{post.views.length===0? "" : post.views.length}</p>
               <Views className={classes.icon}/>
          </div>
          </div>
          <div className={isCommenting? classes.comments : comments.length>0 ? classes.commentsShowOne : classes.commentsHideAll}>
            {comments.map((comment, id) => {
              return ( 
              <div key={id}>
                {editComment && editComment===comment._id?
                <CommentEdit  comment={comment} visitor={visitor}></CommentEdit>
                :
                <Comment comment={comment} visitor={visitor} reply={reply} navigate={navigate} showReplies={showReplies} setShowReplies={setShowReplies} author={author} type={"comment"}
                  likeComment={likeComment}removeLikeComment={removeLikeComment}commentAuthorH5={commentAuthorH5}deleteComment={deleteComment}setEditComment={setEditComment} viewUser={viewUser}
                ></Comment>
                }   
              </div>)
            })}
          </div>
          {isCommenting && <MessageTool messageToolCordY={messageToolCordY} type={replyToComment? 'reply' : 'comment'} 
          setReplyToComment={setReplyToComment} userReplyTo={userReplyTo}/*in case user replying*/ postId={post._id} setComment={setComments} setCommentsLeng={setCommentsLeng}/>}
        </div>
    )
}

function Comment({comment,visitor,reply,navigate,showReplies,setShowReplies,likeComment,commentAuthorH5,removeLikeComment,deleteComment,setEditComment, author, type, viewUser}=props) {
  return (
    <div data-id={comment._id} className={classes.commentWrapper}>
      <div className={classes.comment}>
        <div className={classes.postLeftside}>
          <img className={classes.profilePicture} src={comment.user.avatarUrl} onClick={()=>viewUser(comment)}></img>
          <div className={classes.commentBody}>
            <div className={classes.commentHeader}>
               <h5 ref={commentAuthorH5} className={comment.user._id===visitor._id?classes.myName:classes.authorName}>{comment.user.fullName}</h5>
               <p className={classes.time}>{trimTime(comment.createdAt)}</p>
            </div>
            <p className={classes.text}>{comment.replyTo && <span style={{color:"rgb(53, 121, 199)"}}>{comment.replyTo}, </span>}{comment.text}</p>
            <div className={classes.commentInf}>
              <a href='#' className={classes.reply} onClick={(e) => reply({e})}>reply</a>
              <div className={classes.commentReplies}>
               {comment.replies.length>0 && 
                  <>
                     <div>{comment.replies.map((reply,id) => {if(id!==3) return <img key={id} className={classes.replyImgCircle} src={reply.user.avatarUrl}></img>})}</div>
                     <a onClick={() => {setShowReplies(prev => prev.indexOf(comment._id)===-1? prev = [...prev, comment._id] : prev.splice(prev.indexOf(comment._id),1))}}
                     >{showReplies.indexOf(comment._id)!==-1? "hide" : "show"}</a>
                  </>
                }
              </div>
            </div>
          </div>
        </div>
        <div className={classes.postRightside}>
          <p className={classes.likesNum}>{comment.likes.length===0? "" : comment.likes.length}</p>
          <div className={classes.postRightsideMenu}>
            <ComponentMenu type={"comment"}visitor={visitor}author={author}deleteComment={deleteComment}setEditComment={setEditComment}comment={comment}/>
            <Like className={comment.likes.indexOf(visitor._id)!==-1?classes.myCommentLike : classes.commentLike} onClick={(e) => comment.likes.indexOf(visitor._id)!==-1? removeLikeComment(e, comment):likeComment(e, comment)}/>
          </div>
        </div>
      </div>
      {/* {console.log(comment.replies.length)} */}
      {comment.replies.length>0 && 
      <> {
        comment.type==="comment"? 
        <div className={classes.repliesWrapper}>
        {showReplies.indexOf(comment._id)!==-1 && 
        <div className={classes.replies}>
          {comment.replies.map((comment,id) => {
            return <Comment key={id} comment={comment} author={author} visitor={visitor} navigate={navigate} likeComment={likeComment} removeLikeComment={removeLikeComment} reply={reply} showReplies={showReplies} type={"reply"} viewUser={viewUser}
            />
          })}
        </div>
        }
      </div>
      :
      <div>
        {comment.replies.map((comment,id) => {
          return <Comment key={id} comment={comment} author={author} visitor={visitor} navigate={navigate} likeComment={likeComment} removeLikeComment={removeLikeComment} reply={reply} showReplies={showReplies}  type={"reply"} viewUser={viewUser}
          />
        })}
      </div>
      }
      </>
      }

    </div>
  )
}
{/* <CommentReplies showReplies={showReplies} replies={comment.replies}author={author} reply={reply} visitor={visitor} navigate={navigate} likeComment={likeComment} 
commentAuthorH5={commentAuthorH5} removeLikeComment={removeLikeComment} commentId={comment._id}/>

function CommentReplies({showReplies,replies,author,visitor,navigate,likeComment,removeLikeComment,reply,commentId}=props) {
  return (
    <div className={classes.repliesWrapper}>
      {showReplies.indexOf(commentId)!==-1 && (
      <div className={classes.replies}>
        {replies.map((comment,id) => {
          return <Comment key={id} comment={comment} author={author} visitor={visitor} navigate={navigate} likeComment={likeComment} removeLikeComment={removeLikeComment} reply={reply} showReplies={showReplies} 
          />
        })}
      </div>)}
    </div>
  )
}  */}
function CommentEdit(comment,visitor) {
  return (
    <div className={classes.comment}>
        <div className={classes.postLeftside}>
          <img className={classes.profilePicture} src={comment.user.avatarUrl} onClick={()=>navigate(`/${comment.user._id}`)}></img>
          <div className={classes.commentBody}>
            <div className={classes.commentHeader}>
               <h5 ref={commentAuthorH5} className={comment.user._id===visitor._id?classes.myName:classes.authorName}>{comment.user.fullName}</h5>
               <p className={classes.time}>{trimTime(comment.createdAt)}</p>
            </div>
            <p className={classes.text}>{comment.replyTo && <span style={{color:"rgb(53, 121, 199)"}}>{comment.replyTo}, </span>}{comment.text}</p>
          </div>
        </div>
        <div className={classes.postRightside}>
          <p className={classes.likesNum}>{comment.likes.length===0? "" : comment.likes.length}</p>
          <div>
            <Like className={comment.likes.indexOf(visitor._id)!==-1?classes.myCommentLike : classes.commentLike} onClick={() => comment.likes.indexOf(visitor._id)!==-1? removeLikeComment(comment._id):likeComment(comment._id)}/>
          </div>
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