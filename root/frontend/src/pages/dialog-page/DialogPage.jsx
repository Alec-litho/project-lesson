import classes from './dialogStyle.module.css'
import { ReactComponent as Search } from '../../assets/icons/search.svg';
import {useState, useEffect} from 'react'
import axios from 'axios';
import MessageTool from '../../components/MessageTool';

export default function DialogPage() {
    let friendsList = []
    // for (const [name, info] of Object.entries(data)) {
    //     let person = {name, info}
    //     friendsList.push(person)
    //   }
    // let {users} = friends
    let [messages, setMessages] = useState([])
    let [isLoaded, setLoading] = useState(false)
    let [name, setName] = useState('Alec')//current person who you have dialog with
    function choosePerson(name) {
        setName(name)
    }
    console.log(messages);
    useEffect(_ => {
        axios.get('https://api.jsonbin.io/v3/b/64413cfbebd26539d0af171c', {
            headers: {
                "X-MASTER-KEY": "$2b$10$y3p8j1CGw2n5ZUmWh4kE9OW8R.RqoGXrYo7Q7tlS2mAPj5SKqu.o2"
            }
        }).then(res => {
            setMessages(res.data.record)
            setLoading(true)
        }).catch(err => console.log(err))
        
    }, [])

    return (
        <div className={classes.container}>
            <div className={classes.leftSide}>
                <div className={classes.searchBox}>
                        <Search className={classes.searchSvg}/>
                        <input placeholder='Search'></input>
                </div>
                <div className={classes.dialogList}>
                   {isLoaded && messages.map(obj => {
                       return <Dialog  func={choosePerson} userData={obj.members}/>
                   })}
                </div>
            </div>
            <div className={classes.rightSide}>
                <MessagesWindow  people={friendsList} name={name}/>
                <MessageTool/>
            </div>
        </div>
    )
}


function MessagesWindow(props) {
    let name = props.name
    function handleScroll(e) {
        console.log(e);
    }
    return (
        <div className={classes.dialogBody} onScroll={handleScroll} >
            <div className={classes.friendsMessage}>
                    {/* {props.people.map(person => {
                        if(person.name === name) {
                            let messages = []
                                person.info.map(obj => {
                                messages.push(...obj.messages)//collecting all messages in one array
                                messages.sort((me, friend) => parseInt(me.time.replace(':','')) - parseInt(friend.time.replace(':','')))//sorting array by message time
                            })
                            return messages.map(message => {
                                    return message.id === 1? <Message time={message.time} message={message.message} who={'me'} pp={message.profilePicture}/> : <Message time={message.time} message={message.message} who={'friend'} pp={message.profilePicture}/>//id = 1 is always you
                            })
                        }
                      })
                    } */}
            </div>
        </div>
    )
}
function Message(props) {
    return props.who === 'friend'? 
     (
        <div className={classes.message}>
           <div className={classes.leftSideMessage}>
               <img className={classes.profilePicture}></img>
               <span className={classes.timeMessage}>{props.time}</span>
           </div>
           <div className={classes.rightSideMessage}>
               <span className={classes.messageText}>{props.message}</span>
           </div>
        </div>
    )  : 
    (
        <div className={classes.message}>
            <div className={classes.leftSideMessage}>
               <img className={classes.profilePicture} ></img>
               <span className={classes.timeMessage}>{props.time}</span>
           </div>
           <div className={classes.rightSideMessage}>
               <span className={classes.myMessageText}>{props.message}</span>
           </div>
        </div>
    )
}

function Dialog(props) {
    
    return (
        <div className={classes.dialog} onClick={() => props.func(props.name)}>
           {/* <img className={classes.profilePicture} src={require(`../../assets/friends/${props.picture}.jpg`)}></img> */}
           <div className={classes.personName}>
              <h3>{props.name}</h3>
              <p>{props.lastMessage}</p>
           </div>
           <p className={classes.time}>9:00</p>
        </div>
    )
}