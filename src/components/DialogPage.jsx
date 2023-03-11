import classes from '../style_modules/dialogStyle.module.css'
import data from '../dialog.json'
import { ReactComponent as Search } from '../icons/search.svg';
import { ReactComponent as Emoji } from '../icons/smile.svg';
import { ReactComponent as Clip } from '../icons/clip.svg';
import { ReactComponent as Send } from '../icons/send.svg';


export default function DialogPage() {
    let {arr} = data
    return (
        <div className={classes.container}>
            <div className={classes.leftSide}>
                <div className={classes.searchBox}>
                        <Search className={classes.searchSvg}/>
                        <input placeholder='Search'></input>
                </div>
                <div className={classes.dialogList}>
                   {arr.map(person => {
                       return <Dialog name={person.name} messages={person.messages} lastMessage={person.last_message} picture={person.profilePicture}/>
                   })}
                </div>
            </div>
            <div className={classes.rightSide}>
                <div className={classes.dialogBody}>
                    <div className={classes.friendsMessage}>
                     <Message who={'friend'} messages={data}/>
                    </div>
                    <div className={classes.myMessage}>
                     <Message who={'me'} messages={data}/>
                    </div>
                </div>
                <div className={classes.keyboard}>
                   <Emoji className={classes.emoji}/>
                    <input placeholder='Type'></input>
                        <Clip className={classes.svg}/>
                    <div className={classes.send}>
                        <Send className={classes.sendIcon}/>
                    </div>
                </div>
            </div>
        </div>
    )
}

function Message(props) {
    console.log(props.messages.Alec);
    return props.who === 'friend'? 
     (
        <div className={classes.message}>
           <div className={classes.leftSideMessage}>
               <img className={classes.profilePicture} src={require('../friends/lups.jpg')}></img>
               <span className={classes.timeMessage}>09:00</span>
           </div>
           <div className={classes.rightSideMessage}>

               <span className={classes.messageText}>Just random message just to cchheck</span>
           </div>
        </div>
    )  : 
    (
        <div className={classes.message}>
           <div className={classes.leftSideMessage}>
               <span className={classes.myMessageText}>Just random message just to cchheck</span>
           </div>
           <div className={classes.rightSideMessage}>
               <img className={classes.profilePicture} src={require('../friends/lups.jpg')}></img>
           </div>
        </div>
    )
}
function Dialog(props) {
    console.log(props.picture);

    return (
        <div className={classes.dialog}>
           <img className={classes.profilePicture} src={require('../friends/lups.jpg')}></img>
           <div className={classes.personName}>
              <h3>{props.name}</h3>
              <p>{props.lastMessage}</p>
           </div>
           <p className={classes.time}>9:00</p>
        </div>
    )
}