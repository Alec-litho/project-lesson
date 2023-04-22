import classes from './dialogStyle.module.css'
import { ReactComponent as Search } from '../../assets/icons/search.svg';
import { ReactComponent as Emoji } from '../../assets/icons/smile.svg';
import { ReactComponent as Clip } from '../../assets/icons/clip.svg';
import { ReactComponent as Send } from '../../assets/icons/send.svg';
import {useState, useEffect} from 'react'
import axios from 'axios';

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
    function sendMessage() {

    }
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
                <div className={classes.keyboard}>
                        <Emoji className={classes.emoji}/>
                        <input placeholder='Type'/>
                        <Clip className={classes.svg}/>
                    <div className={classes.send}>
                        <Send className={classes.sendIcon} onClick={sendMessage}/>
                    </div>
                </div>
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
               <img className={classes.profilePicture} src={require(`../../assets/friends/${props.pp}.jpg`)}></img>
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
               <img className={classes.profilePicture} src={require(`../../assets/friends/${props.pp}.jpg`)}></img>
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


// [
//     {
//       "userId": 1,
//       "userFirstname": "Alec",
//       "userLastname": "Kostar",
//       "userAge": 18,
//       "userProfilePicture": "https://i.ibb.co/ss5TTdg/0a4caaaf48292d7eda350062695064c2.jpg",
//       "friends": 1,
//       "subscriptions": 0,
//       "location": "Maikop",
//       "posts": [
//         {
//           "date": 22.01,
//           "year": 2023,
//           "comments": "some comment"
//         },
//         {
//           "date": 21.01,
//           "year": 2023,
//           "comments": "some da"
//         },
//         {
//           "date": 32.01,
//           "year": 2023,
//           "comments": "some commaaent"
//         },
//         {
//           "date": 11.01,
//           "year": 2023,
//           "comments": "some coent"
//         },
//         {
//           "date": "16.3",
//           "year": 2023,
//           "comments": "null"
//         },
//         {
//           "date": "16.3",
//           "year": 2023,
//           "comments": "my new post I FINALLY FUCKING DIDD IT YOOOOOO"
//         },
//         {
//           "date": "16.3",
//           "year": 2023,
//           "comments": "fuckersss"
//         },
//         {
//           "date": "17.3",
//           "year": 2023,
//           "comments": "ВСЕМ ПРИИВЕТ"
//         },
//         {
//           "date": "21.3",
//           "year": 2023,
//           "comments": "New post after i fixed the most mystical bug (at least it looks like i did)"
//         }
//       ],
//       "dialogs": [
//         {
//           "members": [
//             {
//               "name": "Alec",
//               "userId": 1
//             },
//             {
//               "name": "Jayy",
//               "userId": 2
//             }
//           ],
//           "dialogMessages": [
//             {
//               "userId": 1,
//               "messages": [
//                 {
//                   "id": 1,
//                   "profilePicture": "p",
//                   "userName": "Alec",
//                   "time": "9:00",
//                   "message": "You hear the droplets of rain hitting the ground while a lovely music plays from the heavens."
//                 },
//                 {
//                   "id": 1,
//                   "profilePicture": "p",
//                   "userName": "Alec",
//                   "time": "9:01",
//                   "message": "Well, I can positively"
//                 },
//                 {
//                   "id": 1,
//                   "profilePicture": "p",
//                   "userName": "Alec",
//                   "time": "9:01",
//                   "message": "I love this album so much, it feels like every song actually has a meaning to it, Next up forever: about not wanting to grow up because, say I'm in tears because of how much I miss undertale TwT"
//                 },
//                 {
//                   "id": 1,
//                   "profilePicture": "p",
//                   "userName": "Alec",
//                   "time": "9:05",
//                   "message": "Youlovely music plays from the heavens."
//                 },
//                 {
//                   "id": 1,
//                   "profilePicture": "p",
//                   "userName": "Alec",
//                   "time": "9:11",
//                   "message": "You hear the droplets of rain hitting  plays from the heavens."
//                 }
//               ]
//             },
//             {
//               "userId": 2,
//               "messages": [
//                 {
//                   "id": 2,
//                   "profilePicture": "dude",
//                   "userName": "Jayy",
//                   "time": "9:00",
//                   "message": "You hear the droplets heavens."
//                 },
//                 {
//                   "id": 2,
//                   "profilePicture": "dude",
//                   "userName": "Jayy",
//                   "time": "9:02",
//                   "message": "I can"
//                 },
//                 {
//                   "id": 2,
//                   "profilePicture": "dude",
//                   "userName": "Jayy",
//                   "time": "9:02",
//                   "message": "I love every song because, say I'm in tears because of how much I miss undertale TwT"
//                 },
//                 {
//                   "id": 2,
//                   "profilePicture": "dude",
//                   "userName": "Jayy",
//                   "time": "9:07",
//                   "message": "Youlovely music plays from the heavens. I love this album so much, it feels like every song actually has a meaning to it, Next up forever, I love this album so much, it feels like every song "
//                 },
//                 {
//                   "id": 2,
//                   "profilePicture": "dude",
//                   "userName": "Jayy",
//                   "time": "9:10",
//                   "message": "plays from the heavens."
//                 }
//               ]
//             }
//           ]
//         }
//       ]
//     }
//   ]