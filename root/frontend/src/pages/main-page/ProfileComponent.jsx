import { Link } from "react-router-dom"
import Dialog from "../dialog-page/DialogPage"
import classes from './style/mainPage.module.css';

export default function Profile({avatarUrl, fullName, location, friends, age}) {
    // let profPicture = props.profilePicture? props.profilePicture : null
    return (
        <div className={classes.profileContainer}>
            <div className={classes.profilePictureWrapper}>
                <div className={classes.profilePictureBg}></div>
                <img src={avatarUrl} className={classes.profilePicture}></img>
            </div>
           
            <div className={classes.infoBlock}>
            <h1>{fullName}</h1>
            <div className={classes.defaultInfo}>
                <div className={classes.leftInfoBlock}>
                    <p>Location:</p>
                    <p>Friends:</p>
                    <p>Age:</p>
                </div>
                <div className={classes.rightInfoBlock}>
                    <a href="#">{location}</a>
                    <a href="#">{friends}</a>
                    <a href="#">{age}</a>
                </div>
            </div>
            <button className={classes.book}> <Link to="/dialogs" element={<Dialog/>}>Message</Link></button>
            <button className={classes.subscribe}>Subscribe</button>
           </div>
        </div>
    )
}