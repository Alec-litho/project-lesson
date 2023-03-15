import logo from './logo.svg';
import './App.css';
import { ReactComponent as Search } from './icons/search.svg';
import { Route, Routes, Link} from 'react-router-dom';
import Dialog from './components/DialogPage.jsx'
import Main from './components/MainPage.jsx'
import Music from './components/MusicPage.jsx'
import Subscriptions from './components/SubscriptionsPage.jsx'
import Gallery from './components/Gallery.jsx'
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
                <img className='logo' src={require('./logo.png')}></img>
                <Nav/>
            </div>
            <div className='rightSideContent'>
                <div className='search'>
                    <Search className='searchSvg'/>
                    <input placeholder='search'></input>
                </div>
                <div className='profile'>
                <div className='level'>9</div>
                <div><img  className="profileCircle" src={require('./friends/p.jpg')}></img></div>
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
