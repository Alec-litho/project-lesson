import{ ReactComponent as Notifications } from '../assets/icons/bell.svg'
import { useAppDispatch, useAppSelector } from '../hooks/reduxCustomHooks';
import classes from '../styles/notification.module.css'
import { useRef, useState, useEffect } from 'react';
import { getNotificationMessages, updateViewedMessages } from "../features/notificationsSlice";
import viewCount from '../helper_functions/viewCount';

export function Notification({userId}:{userId:string}) {
    const dispatch = useAppDispatch();
    const notifications = useAppSelector((state) => state.notifications);
    const notificationsComponent = useRef<null|HTMLDivElement>(null);
    const notificationMark = useRef<null|HTMLDivElement>(null);
    const notificationMessageRef = useRef<null|HTMLDivElement>(null);
    let notificationOpened = useRef(false);
    let [currNotifications, setCurrNotifications] = useState<[]|currPostType[]>([]);
    let [viewedNotifications, setViewedNotifications] = useState<number>(0)//number of Notifications that were viewed to user after loading another new Notifications (initially its 0)
    console.log(currNotifications, viewedNotifications)

    useEffect(() => {
        let notificationCount = notifications.archivedNotificationMessages.length + notifications.newNotificationMessages.length
        if(notificationCount===0 || currNotifications.length === viewedNotifications) {//if posts array is empty or if we need to request more posts
            if(viewedNotifications !== 0) setViewedNotifications(prev => prev-1);
            dispatch(getNotificationMessages({userId, messagesNum:viewedNotifications}))
                .then((response:any) => {
                  
                })
        } 
    }, [viewedNotifications])

    function handleNotificationWindow() {
        const [parent,child] = [notificationsComponent.current!,notificationMessageRef.current!]
        notificationOpened.current = !notificationOpened.current 
  
        //So i want to set all notification messages that user can see after opening notification window to viewed=true
        //the amount of notification messages depends on height of notification window and notification message
        //if i divide first with second i should get 7, but offsetHeight returns 0 -- fix it
        const msgsAmountOnThePage = Math.floor(parent.offsetHeight/child.offsetHeight);
        console.log(parent,parent.offsetHeight,child,child.offsetHeight)
        setViewedNotifications(msgsAmountOnThePage)



        if(notificationOpened.current ) {
            parent.style.display = "flex"
                currNotifications.slice(0,msgsAmountOnThePage).forEach((msg) => dispatch(updateViewedMessages(msg.itemId)))
        } else {
            parent.style.display = "none"
        }
    }

    return (
        <div className={classes.notificationsParentComponent}>
            <div className={classes.newNotificationMark} ref={notificationMark} 
            style={{display:notifications.newNotificationMessages.length>0?"flex":"nones"}}>
            </div>
            <Notifications className={classes.notificationIcon} onClick={handleNotificationWindow}/>
            <div className={classes.notificationsComponent} ref={notificationsComponent} 
            onScroll={() => viewCount({dispatch,currItems:currNotifications,viewedItems:viewedNotifications, setViewedItems:setViewedNotifications,type:"notification",parentObj:notificationsComponent.current!})}>
                {
                    [...notifications.archivedNotificationMessages, ...notifications.newNotificationMessages]
                    .map((message:NotificationMessage, indx:number, arr) => {
                        return <NotificationMessageComponent key={message._id} 
                        setCurrNotifications={setCurrNotifications} message={message} notificationMessageRef={notificationMessageRef}/>
                    })
                }
            </div>
        </div>
    )
}
interface INotificationMessage {
    setCurrNotifications: (callback:(prev: currPostType[]) => currPostType[] | []) => void 
    message: NotificationMessage
    notificationMessageRef:any
}

function NotificationMessageComponent({setCurrNotifications, message, notificationMessageRef}:INotificationMessage) {
    // let notificationMessageY = useRef<null|HTMLDivElement>(null);


    useEffect(() => {
        const positionY = notificationMessageRef.current!.offsetTop
        setCurrNotifications((prevState) => [...prevState, {itemId:message._id, watched:JSON.parse(message.viewed), positionY}])
    },[])
    return <div className={classes.notificationsMessages} ref={notificationMessageRef}>
                <div className={classes.leftSide}>
                    <div className={classes.header}><p>{message.type.description}</p></div>
                    <div className={classes.body}><p>{message.text}</p></div>
                </div>
                <div  className={classes.rightSide}>
                    <img src={message.type.image}></img>
                </div>
            </div>
}