import '../App.css'
import { Route, Routes, Link, useParams} from 'react-router-dom';
import { ReactComponent as Search } from '../assets/icons/search.svg';
import Dialog from '../pages/dialog-page/DialogPage.jsx'
import Main from '../pages/main-page/UserPage'
import Music from '../pages/music-page/MusicPage.jsx'
import Feed from '../pages/feed-page/FeedPage'
import Gallery from '../pages/gallery-page/Gallery.jsx'
import { Notification } from './Notification';
import { useState } from 'react';
import Settings from '../pages/settings-page/SettingsPage';
import Login from '../pages/login-page/Login';
import { useDispatch } from 'react-redux';
import { logout } from '../features/authSlice';

export default function Header({avatarUrl,authId, setSliderTrue, sliderTrue, currPictureId, setCurrPictureId}) {
    let [profileMenuViewed, setProfileMenuViewed] = useState(false);
    let dispatch = useDispatch();
    return (
        <div className="header">
            <div className='leftSideContent'>
                <img className='logo' src={require('../assets/icons/logo.png')}></img>
                <div className='nav'>
                   <Link to={`/gallery/${authId}`} element={<Gallery/>}>Gallery</Link>
                   <Link to="/music" element={<Music/>}>Music</Link>
                   <Link to={`/user/${authId}`} element={<Main setSliderTrue={setSliderTrue} sliderTrue={sliderTrue} currPictureId={currPictureId} setCurrPictureId={setCurrPictureId}/>}>Home</Link>
                   <Link to="/feed" element={<Feed setSliderTrue={setSliderTrue} sliderTrue={sliderTrue} currPictureId={currPictureId} setCurrPictureId={setCurrPictureId}/>}>Feed</Link>
                   <Link to="/dialogs" element={<Dialog/>}>Dialogs</Link>
                </div>
            </div>
            <div className='rightSideContent'>
                <Notification userId={authId}/>
                <div className='search'>
                    <Search className='searchSvg'/> 
                    <input placeholder='search'></input>
                </div>
                <div className='profile' onClick={() => setProfileMenuViewed(!profileMenuViewed)}>
                        <img  className="profileCircle" src={avatarUrl}></img>
                       { profileMenuViewed &&
                        <div className="profileMenu">
                            <ul>
                                <li><Link to={`/settings`} element={<Settings/>}>Settings</Link></li>
                                <li onClick={() => dispatch(logout())}><Link to={`/login`} element={<Login/>}>Log out</Link></li>
                            </ul>
                        </div>}

                </div>
            </div>
        </div>
    )
}

