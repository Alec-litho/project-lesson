import '../App.css'
import { Route, Routes, Link} from 'react-router-dom';
import { ReactComponent as Search } from '../assets/icons/search.svg';
import Dialog from '../pages/dialog-page/DialogPage.jsx'
import Main from '../pages/main-page/UserPage'
import Music from '../pages/music-page/MusicPage.jsx'
import Feed from '../pages/feed-page/FeedPage.jsx'
import Gallery from '../pages/gallery-page/Gallery.jsx'


export default function Header(props) {
    return (
        <div className="header">
            <div className='leftSideContent'>
                <img className='logo' src={require('../assets/icons/logo.png')}></img>
                <Nav/>
            </div>
            <div className='rightSideContent'>
                <div className='search'>
                    <Search className='searchSvg'/>
                    <input placeholder='search'></input>
                </div>
                <div className='profile'>
                <div className='level'>9</div>
                {/* <div><img  className="profileCircle" src={require('./friends/p.jpg')}></img></div> */}
                </div>
            </div>
        </div>
    )
}

function Nav() {
    return (
        <div className='nav'>
           <Link to="/gallery" element={<Gallery/>}>Gallery</Link>
           <Link to="/music" element={<Music/>}>Music</Link>
           <Link to="/" element={<Main/>}>Home</Link>
           <Link to="/feed" element={<Feed/>}>Feed</Link>
           <Link to="/dialogs" element={<Dialog/>}>Dialogs</Link>
        </div>
    )
}