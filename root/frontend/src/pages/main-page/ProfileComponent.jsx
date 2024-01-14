import { Link } from "react-router-dom";
import Dialog from "../dialog-page/DialogPage";
import Settings from '../settings-page/SettingsPage'
import classes from './style/userPage.module.css';
import { ReactComponent as Friends } from '../../assets/icons/friends.svg';
import { ReactComponent as Location } from '../../assets/icons/location.svg';
import { ReactComponent as Age } from '../../assets/icons/age.svg';
import { ReactComponent as Report } from '../../assets/icons/report.svg';
import { ReactComponent as Block } from '../../assets/icons/block.svg';
import { ReactComponent as Options } from '../../assets/icons/options.svg';
import { useRef, useState } from "react";
import {useSelector} from 'react-redux'


export default function Profile({avatarUrl, fullName, location, friends, age, user}) {
    const auth = useSelector(state => state.auth)
    const options = useRef(null);
    const [areOptionsOpen, setOptions] = useState(false)
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
                    <Location className={classes.profileIcon}/>
                    <Friends className={classes.profileIcon}/>
                    <Age className={classes.profileIcon}/>
                </div>
                <div className={classes.rightInfoBlock}>
                    <a href="#">{location}</a>
                    <a href="#">{friends}</a>
                    <a href="#">{age}</a>
                </div>
            </div>
            <ProfileMenu userId={user._id} visiterId={auth.userId} options={options} setOptions={setOptions} areOptionsOpen={areOptionsOpen}/>
           </div>
        </div>
    )
}

function ProfileMenu({userId, visiterId, options, setOptions, areOptionsOpen/*logged user*/}) {
    return (
        <>
        {userId===visiterId? 
        <div className={classes.menu}>
            <div className={classes.settingsBtnWrapper} >
                <Link to="/settings" className={classes.settingsBtn} element={<Settings/>} >settings</Link>
            </div>
        </div> :
        <div className={classes.menu}>
         <button className={classes.book}> <Link to="/dialogs" element={<Dialog/>} className={classes.messageBtn}>Message</Link></button>
            <div className={classes.profileToolsMenu}>
                <button className={classes.subscribe}>Subscribe</button>
                <button className={classes.optionsIcon}>
                    {/* i need to implement same logic as i already did for post options */}
                    <Options className={classes.profileIcon} onClick={() => {options.current.style.display = areOptionsOpen? "none":"flex";setOptions(prev=>!prev)}}/>
                    {/* i need to implement same logic as i already did for post options */}
                </button>
                <div ref={options} className={classes.options}>
                    <button className={classes.block}><Block className={classes.profileIcon}/></button>
                    <button className={classes.report}><Report className={classes.profileIcon}/></button>
                </div>
            </div>
            </div>}
        </>
    )
}