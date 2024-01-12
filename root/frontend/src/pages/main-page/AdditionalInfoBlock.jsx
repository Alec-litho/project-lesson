import classes from './style/userPage.module.css'


export default function AdditionalInfoBlock() {

    const friends = [
        {fullName:"Alec",profilePicture:"https://i.ibb.co/tsCxwT4/IMG-20210320-234356.jpg"},
        {fullName:"Opal",profilePicture:"https://i.ibb.co/MDV4xHJ/x-Yv-MI2o86y-M.jpg"},
        {fullName:"Vania",profilePicture:"https://i.ibb.co/wzDNfQz/4d282406c69b6771039c865cb83b355c.jpg"},
        {fullName:"Noname",profilePicture:"https://i.ibb.co/Bqm8N2r/default-avatar-profile-trendy-style-social-media-user-icon-187599373.jpg"},
        {fullName:"Lera",profilePicture:"https://i.ibb.co/mTY4MNP/u-S4ghdq-CJ08.jpg"}
    ]
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