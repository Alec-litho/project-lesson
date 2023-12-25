import { Link } from "react-router-dom"
import Dialog from "../dialog-page/DialogPage"
import classes from './mainPage.module.css';

export default function Profile({avatarUrl, fullName, location, friends, age}) {
    // let profPicture = props.profilePicture? props.profilePicture : null
    return (
        <div className={classes.profileContainer}>
            <img src={avatarUrl} className={classes.pofilePicture}></img>
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