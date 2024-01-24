import classes from './style/userPage.module.css'


export default function AdditionalInfoBlock() {
    const friends = []
    return (
        <div className={classes.additionalInfoBlock}>
            <div className={classes.friends}>
                {friends.map((friend, key) => {
                    return <div className={classes.friendCircle} key={key}>
                        <img src={friend.profilePicture} className={classes.friendCircleImg}></img>
                        <p>{friend.fullName}</p>
                    </div>
                })}
            </div>
            <div className={classes.dialogs}>
                
            </div>
        </div>
    )
}