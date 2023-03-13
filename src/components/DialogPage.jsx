import classes from '../style_modules/dialogStyle.module.css'
import data from '../data/myDialogs.json'
import friends from '../data/users.json'
import { ReactComponent as Search } from '../icons/search.svg';
import { ReactComponent as Emoji } from '../icons/smile.svg';
import { ReactComponent as Clip } from '../icons/clip.svg';
import { ReactComponent as Send } from '../icons/send.svg';
import {useState} from 'react'

export default function DialogPage() {
    let friendsList = []
    for (const [name, info] of Object.entries(data)) {
        let person = {name, info}
        friendsList.push(person)
      }
    let {users} = friends
    let [name, setName] = useState('Alec')//current person who you have dialog with
    function choosePerson(name) {
        setName(name)
    }
    return (
        <div className={classes.container}>
            <div className={classes.leftSide}>
                <div className={classes.searchBox}>
                        <Search className={classes.searchSvg}/>
                        <input placeholder='Search'></input>
                </div>
                <div className={classes.dialogList}>
                   {users.map(person => {
                       return <Dialog  func={choosePerson} name={person.name} picture={person.profilePicture}/>
                   })}
                </div>
            </div>
            <div className={classes.rightSide}>
                <MessagesWindow people={friendsList} name={name}/>
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


function MessagesWindow(props) {
    let name = props.name
    return (
        <div className={classes.dialogBody}>
            <div className={classes.friendsMessage}>
                    {props.people.map(person => {
                        if(person.name === name) {
                            let messages = []
                                person.info.map(obj => {
                                messages.push(...obj.messages)//collecting all messages in one array
                                messages.sort((me, friend) => parseInt(me.time.replace(':','')) - parseInt(friend.time.replace(':','')))//sorting array by message time
                            })
                            return messages.map(message => {
                                    return message.id === 1? <Message obj={message} who={'me'} pp={message.profilePicture}/> : <Message obj={message} who={'friend'} pp={message.profilePicture}/>//id = 1 is always you
                            })
                        }
                      })
                    }
            </div>
        </div>
    )
}
function Message(props) {
    return props.who === 'friend'? 
     (
        <div className={classes.message}>
           <div className={classes.leftSideMessage}>
               <img className={classes.profilePicture} src={require(`../friends/${props.pp}.jpg`)}></img>
               <span className={classes.timeMessage}>09:00</span>
           </div>
           <div className={classes.rightSideMessage}>
               <span className={classes.messageText}>{props.obj.message}</span>
           </div>
        </div>
    )  : 
    (
        <div className={classes.message}>
           <div className={classes.leftSideMessage}>
               <span className={classes.myMessageText}>{props.obj.message}</span>
           </div>
           <div className={classes.rightSideMessage}>
               <img className={classes.profilePicture} src={require(`../friends/${props.pp}.jpg`)}></img>
           </div>
        </div>
    )
}
function Dialog(props) {

    return (
        <div className={classes.dialog} onClick={() => props.func(props.name)}>
           <img className={classes.profilePicture} src={require(`../friends/${props.picture}.jpg`)}></img>
           <div className={classes.personName}>
              <h3>{props.name}</h3>
              <p>{props.lastMessage}</p>
           </div>
           <p className={classes.time}>9:00</p>
        </div>
    )
}
