
import './App.css';
import { ReactComponent as Search } from './assets/icons/search.svg';
import { Route, Routes, Link} from 'react-router-dom';
import Dialog from './pages/dialog-page/DialogPage.jsx'
import Main from './pages/main-page/MainPage.jsx'
import Music from './pages/music-page/MusicPage.jsx'
import Subscriptions from './pages/subscriptions-page/SubscriptionsPage.jsx'
import Gallery from './pages/gallery-page/Gallery.jsx'
//-----------------------------------------------//
function App() {
    return (
        <div>
        <div className='headerBackground'>
            <div className='wrapper'>
                <Header/>
            </div>
        </div>
        <div className='body'>
            <div className='wrapper'>
            <Routes>
                <Route path="/dialogs" element={<Dialog/>}/>
                <Route path="/main" element={<Main/>}/>
                <Route path="/music" element={<Music/>}/>
                <Route path="/subscriptions" element={<Subscriptions/>}/>
                <Route path="/gallery" element={<Gallery/>}/>
            </Routes>
            
            </div>
        </div>
        </div>
    )
}


function Header() {
    return (
        <div className="header">
            <div className='leftSideContent'>
                <img className='logo' src={require('./assets/icons/logo.png')}></img>
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
           <Link to="/main" element={<Main/>}>Home</Link>
           <Link to="/subscriptions" element={<Subscriptions/>}>Subscriptions</Link>
           <Link to="/dialogs" element={<Dialog/>}>Dialogs</Link>
        </div>
    )
}


export {App};
