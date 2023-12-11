import { ReactComponent as Emoji } from '../assets/icons/smile.svg';
import { ReactComponent as Clip } from '../assets/icons/clip.svg';
import { ReactComponent as Send } from '../assets/icons/send.svg';
import { ReactComponent as Cross } from '../assets/icons/cross.svg';
import classes from '../styles/messageTool.module.css'
import { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { uploadComment, uploadReply } from '../features/postSlice';


export default function MessageTool({userInfo,type,setReplyToComment,postId,messageToolCordY}) {
    let message = useRef(null);
    let [inputNum, setInputNum] = useState(0);
    const token = useSelector(state => state.auth.token);
    const user = useSelector(state => state.auth.userInfo);
    const dispatch = useDispatch();
    console.log(userInfo);

    return <div ref={messageToolCordY} className={classes.keyboard}>
        {type === 'reply' && 
        <div className={classes.keyboardReply}>
            <h5>You're replying to <span className={classes.userName} onClick={()=>window.scrollTo({top:userInfo.cordY-350, behavior:'smooth'})}>{userInfo.name}</span></h5>
            <Cross className={classes.cross} onClick={() => setReplyToComment(false)}/>
        </div>}
        <div className={classes.keyboardBody}>
        <Clip className={classes.append}/>
        <Emoji className={classes.emoji}/>
        <input ref={message} className={classes.keyboardInput} onInput={e => setInputNum(e.target.value.length)} placeholder='Type'/>
        <div className={classes.send}>
            <Send className={inputNum>0? classes.sendIcon : classes.sendIconHide} onClick={_ => {
                if(inputNum>0) {
                    if(type === 'comment')  {
                        dispatch(uploadComment({text:message.current.value, user:user._id, authorName:user.fullName,authorPicture:user.avatarUrl, postId, replyTo:false, token}));
                    }
                    if(type === 'reply') {
                        console.log(userInfo.commentId);
                        dispatch(uploadReply({text:message.current.value, user:user._id, authorName:user.fullName,authorPicture:user.avatarUrl, commentId:userInfo.commentId, replyTo: userInfo.name, token}))
                        setReplyToComment(false)
                    }
                    else if(type === 'message') {
                        console.log('message')/*dispatch(message)*/
                    }
                }
                message.current.value = ''
            }}/>
        </div>
        </div>

    </div>
}