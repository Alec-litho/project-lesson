
import './App.css';
import { ReactComponent as Search } from './assets/icons/search.svg';
import { Route, Routes, Link} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux'
import {selectIsAuth, logout} from './features/authSlice'
import Dialog from './pages/dialog-page/DialogPage.jsx'
import Main from './pages/main-page/MainPage.jsx'
import Music from './pages/music-page/MusicPage.jsx'
import Subscriptions from './pages/subscriptions-page/SubscriptionsPage.jsx'
import Gallery from './pages/gallery-page/Gallery.jsx'
import Login from './pages/login-page/Login.jsx'
import Register from './pages/register-page/Register.jsx'
//-----------------------------------------------//
function App() {
    let dispatch = useDispatch()
    let isAuth = useSelector(selectIsAuth)
    return (
        <div>
        <div className='headerBackground'>
            <div className='wrapper'>
                <Header isAuth={isAuth} dispatch={dispatch} logout={logout}/>
            </div>
        </div>
        <div className='body'>
            <div className='wrapper'>
            {!isAuth? <Login/> : 
            <Routes>
                <Route path="/dialogs" element={<Dialog/>}/>
                <Route path="/" element={<Main/>}/>
                <Route path="/music" element={<Music/>}/>
                <Route path="/subscriptions" element={<Subscriptions/>}/>
                <Route path="/gallery" element={<Gallery/>}/>
                <Route path="/login" element={<Login/>}/>
                <Route path="/register" element={<Register/>}/>
            </Routes>
            }

            </div>
        </div>
        </div>
    )
}


function Header(props) {
    return (
        <div className="header">
            <div className='leftSideContent'>
                <img className='logo' src={require('./assets/icons/logo.png')}></img>
                <Nav/>
            </div>
            <div className='rightSideContent'>
            {!props.isAuth?         
                <div className='login'>
                    <button>Log in</button>
                </div> :
                <div className='logout'>
                    <button onClick={_ => props.dispatch(props.logout())} >Log out</button>
                </div>}
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
           <Link to="/subscriptions" element={<Subscriptions/>}>Subscriptions</Link>
           <Link to="/dialogs" element={<Dialog/>}>Dialogs</Link>
        </div>
    )
}


export {App};
