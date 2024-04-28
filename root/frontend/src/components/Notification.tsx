import{ ReactComponent as Notifications } from '../assets/icons/bell.svg'
import classes from '../styles/notification.module.css'
import { useRef, useState } from 'react';

interface NotificationMessage {
    text: string
    date: string
    type: {description: string, image: string}
    viewed: boolean
}

export function Notification({userId}:{userId:string}) {
    const notificationsComponent = useRef<null|HTMLDivElement>(null);
    const notificationIcon = useRef<null|SVGSVGElement>(null);
    const notificationMark = useRef<null|HTMLDivElement>(null);
    const eventSource = new EventSource("http://localhost:3001/notifications/listen_for");
    const [notificationsMessages, setNotificationsMessages] = useState<[]|NotificationMessage[]>([
        {text:"friend request was sent to you from this person",date:"26.04.2024", type:{description:"friend request", image:"https://i.ibb.co/h73PKhM/logo.png"}, viewed:false}
    ]);

    notificationIcon.current?.addEventListener("click", () => {
        console.log('w')
        const element = notificationsComponent.current as HTMLDivElement
        element.className = element.className === 'notificationsComponent'?'notificationsComponent show':'notificationsComponent'
        const viewedNotifications = notificationsMessages.map(message => {return {...message, viewed:true}})
        setNotificationsMessages(viewedNotifications)
    })

    eventSource.addEventListener(`friend_request_to_${userId}`, (message) => {
        console.log(message)
    })

    return (
        <div className={classes.notificationsParentComponent}>
            <div className={classes.newNotificationMark} ref={notificationMark}></div>
            <Notifications className={classes.notificationIcon} ref={notificationIcon}/>
            <div className={classes.notificationsComponent} ref={notificationsComponent}>
                {
                    notificationsMessages.map((message:NotificationMessage, indx:number) => {
                        return <div className={classes.notificationsMessages}>
                                <div className={classes.leftSide}>
                                    <div className={classes.header}><p>{message.type.description}</p></div>
                                    <div className={classes.body}><p>{message.text}</p></div>
                                </div>
                                <div  className={classes.rightSide}>
                                    <img src={message.type.image}></img>
                                </div>
                        </div>
                    })
                }
            </div>
        </div>
    )
}