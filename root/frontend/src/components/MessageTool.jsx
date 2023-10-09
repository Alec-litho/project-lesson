import { ReactComponent as Emoji } from '../assets/icons/smile.svg';
import { ReactComponent as Clip } from '../assets/icons/clip.svg';
import { ReactComponent as Send } from '../assets/icons/send.svg';
import { ReactComponent as Cross } from '../assets/icons/cross.svg';
import classes from '../styles/messageTool.module.css'
import { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { postComment, postReply } from '../features/postSlice';


export default function MessageTool(props) {
    let message = useRef(null);
    let [inputNum, setInputNum] = useState(0);
    const token = useSelector(state => state.auth.token);
    const userInfo = useSelector(state => state.auth.userInfo);
    const dispatch = useDispatch();
    console.log(props.userName);

    return <div className={classes.keyboard}>
        {props.type === 'reply' && 
        <div className={classes.keyboardReply}>
            <h5>You're replying to <span>{props.userName}</span></h5>
            <Cross className={classes.cross} onClick={() => props.setReplyToComment(false)}/>
        </div>}
        <div className={classes.keyboardBody}>
        <Clip className={classes.append}/>
        <Emoji className={classes.emoji}/>
        <input ref={message} className={classes.keyboardInput} onInput={e => setInputNum(e.target.value.length)} placeholder='Type'/>
        <div className={classes.send}>
            <Send className={inputNum>0? classes.sendIcon : classes.sendIconHide} onClick={_ => {
                if(inputNum>0) {
                    if(props.type === 'comment')  {
                        dispatch(postComment({text:message.current.value, user:userInfo._id, authorName:userInfo.fullName,authorPicture:userInfo.avatarUrl, postId:props.postId, token}));
                    }
                    if(props.type === 'reply') {
                        dispatch(postReply({text:message.current.value, user:userInfo._id, authorName:userInfo.fullName,authorPicture:userInfo.avatarUrl, postId:props.postId, token}))
                    }
                    else if(props.type === 'message') {
                        console.log('message')/*dispatch(message)*/
                    }
                }
                message.current.value = ''
            }}/>
        </div>
        </div>

    </div>
}