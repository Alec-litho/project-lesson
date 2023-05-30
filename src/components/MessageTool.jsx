import { ReactComponent as Emoji } from '../assets/icons/smile.svg';
import { ReactComponent as Clip } from '../assets/icons/clip.svg';
import { ReactComponent as Send } from '../assets/icons/send.svg';
import classes from '../styles/messageTool.module.css'
import { useRef, useState } from 'react';

export default function MessageTool(props) {
    let message = useRef(null)
    let [inputNum, setInputNum] = useState(0)
    console.log(inputNum);
    return <div className={classes.keyboard}>
         <Clip className={classes.append}/>
        <Emoji className={classes.emoji}/>
        <input ref={message} className={classes.keyboardInput} onInput={e => setInputNum(e.target.value.length)} placeholder='Type'/>
        <div className={classes.send}>
            <Send className={inputNum>0? classes.sendIcon : classes.sendIconHide} onClick={_ => {if(inputNum>0)props.uploadMessage(message.current.value)}}/>
        </div>
    </div>
}