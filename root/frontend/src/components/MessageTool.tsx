// import { ReactComponent as Emoji } from '../assets/icons/smile.svg';
// import { ReactComponent as Clip } from '../assets/icons/clip.svg';
// import { ReactComponent as Send } from '../assets/icons/send.svg';
// import { ReactComponent as Cross } from '../assets/icons/cross.svg';
import classes from '../styles/messageTool.module.css'
import { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { uploadComment, uploadReply } from '../features/postSlice';
import { Dispatch, SetStateAction, Ref} from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/reduxCustomHooks';

type ReplyType = {
    type: string,
    setReplyToComment: Dispatch<SetStateAction<Boolean | null>>,
    postId: string,
    messageToolCordY: Ref<HTMLDivElement>,
    userReplyTo: {commentId: string,name:string, cordY:number}
}

export default function MessageTool({type,setReplyToComment,messageToolCordY,postId,userReplyTo}:ReplyType) {
    let message = useRef<HTMLInputElement>(null);
    let [inputNum, setInputNum] = useState(0);

    const user = useAppSelector(state => state.auth);
    const dispatch = useAppDispatch();
    // console.log(userInfo);//too many messages

    return <div ref={messageToolCordY} className={classes.keyboard}>
        {type === 'reply' && 
        <div className={classes.keyboardReply}>
            <h5>You're replying to <span className={classes.userName} onClick={()=>window.scrollTo({top:userReplyTo.cordY-350, behavior:'smooth'})}>{userReplyTo.name}</span></h5>
            <div className={classes.cross} onClick={() => setReplyToComment(false)}/>
        </div>}
        <div className={classes.keyboardBody}>
        {/* <Clip className={classes.append}/>
        <Emoji className={classes.emoji}/> */}
        <input ref={message} className={classes.keyboardInput} onInput={(e) => {
            let target=e.target as HTMLInputElement;
            setInputNum(target.value.length)
        }} placeholder='Type'/>
        <div className={classes.send}>
            <div /*Send*/ className={inputNum>0? classes.sendIcon : classes.sendIconHide} onClick={() => {
                if(inputNum>0) {
                    if(type === 'comment')  {
                        const text = message.current? message.current.value : "";
                        // const comment = {text, user:user.userInfo._id, authorName:userReplyTo.name,authorPicture:user.avatarUrl, post:postId, replyTo:false} as CreateCommentDto
                        const comment = {text, user:user.userInfo._id,post:postId, replyTo:false}
                        dispatch(uploadComment({comment, token:user.userToken}));
                    }
                    if(type === 'reply') {
                        console.log(userReplyTo.commentId);
                        const text = message.current? message.current.value : "";
                        const comment = {text, user:user.userInfo._id, authorName:user.userInfo.fullName,authorPicture:user.userInfo.avatarUrl, commentId:userReplyTo.commentId, replyTo: userReplyTo.name, post:postId}
                        dispatch(uploadReply({comment, id:userReplyTo.commentId, token:user.userToken}))
                        setReplyToComment(false)
                    }
                    else if(type === 'message') {
                        console.log('message')/*dispatch(message)*/
                    }
                };
                if(message.current) message.current.value = ''
            }}/>
        </div>
        </div>

    </div>
}