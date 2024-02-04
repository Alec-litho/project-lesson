import classes from './style/userPage.module.css';
import { useNavigate } from 'react-router-dom';

interface ComponentProps {
    possibleFriends: IUser[]
    visitor: string | undefined
    user: string
}

export default function AdditionalInfoBlock({possibleFriends, visitor, user}:ComponentProps) {
    const navigate = useNavigate();
    const friends:IUser[]|[] = [];
    const commonFriends:IUser[]|[] = [];
    return (
        <div className={classes.additionalInfoBlock}>
            {visitor===user && <div className={classes.possibleFriendsBlock}>
                <h3 className={classes.blockText}>Possible friends</h3>
                <div className={classes.possibleFriendsBody}>
                {possibleFriends.map((friend:IUser, indx:number) => {
                    return <div className={classes.friendCircle} key={friend._id} >
                        <img src={friend.avatarUrl} className={classes.friendCircleImg} onClick={() => navigate(`/user/${friend._id}`)}></img>
                        <p>{friend.fullName.length>6? friend.fullName.slice(0,6)+'...' : friend.fullName}</p>
                    </div>
                })}
                </div>
          
            </div>}
            {visitor!==user && <div className={classes.commonFriendsBlock}>
                <h3 className={classes.blockText}>Common friends</h3>
                <div className={classes.commonFriendsBody}>
                {commonFriends.length===0? <h3 className={classes.emptyText}>No common friends</h3>
                :
                commonFriends.map((friend:IUser, indx:number) => {
                    return <div className={classes.friendCircle} key={friend._id} >
                        <img src={friend.avatarUrl} className={classes.friendCircleImg} onClick={() => navigate(`/user/${friend._id}`)}></img>
                        <p>{friend.fullName.length>6? friend.fullName.slice(0,6)+'...' : friend.fullName}</p>
                    </div>
                })}
                </div>
          
            </div>}
            <div className={classes.friends}>
                {friends.map((friend:IUser, indx:number) => {
                    return <div className={classes.friendCircle} key={friend._id}>
                        <img src={friend.avatarUrl} className={classes.friendCircleImg}></img>
                        <p>{friend.fullName}</p>
                    </div>
                })}
            </div>

        </div>
    )
}