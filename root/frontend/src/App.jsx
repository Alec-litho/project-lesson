import "./App.css";
import { Route, Routes,redirect } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {getCookie, logout, getMe} from "./features/authSlice";
import Dialog from "./pages/dialog-page/DialogPage";
import User from "./pages/main-page/UserPage";
import Music from "./pages/music-page/MusicPage";
import Feed from "./pages/feed-page/FeedPage";
import Gallery from "./pages/gallery-page/Gallery";
import Login from "./pages/login-page/Login";
import Register from "./pages/register-page/Register";
import Header from "./components/Header";
import Error from "./pages/error-page/Error"
import Settings from "./pages/settings-page/SettingsPage"
import { useEffect } from "react";
// -----------------------------------------------//

export default function App() {
  const dispatch = useDispatch();
  dispatch(getCookie())
  const {isAuth, userToken, userId, status, error, userInfo} = useSelector((state) => state.auth);
  useEffect(() => {
    console.log(status, error);
    if(!isAuth) {
      console.log(userId,userToken);
      if(status !== 'error') dispatch(getMe({_id:userId, token:userToken}));
    }
    if(error) {
      console.log('redirect');
      redirect("/error")//not working
    }
  },[error])
  return (
    <div>
      <div className="headerBackground">
        <div className="wrapper">
          <Header isAuth={isAuth} dispatch={dispatch} logout={logout} avatarUrl={userInfo.avatarUrl}/>
        </div>
      </div>
      <div className="body">
        <div className="wrapper">
          {!isAuth?
          (
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/*" element={<Login />} />
              <Route path="/error" element={<Error />} />
            </Routes>
          ) : (
            <Routes>
              <Route path="/dialogs" element={<Dialog />} />
              <Route path="/:id" element={<User />} />
              <Route path="/" element={<User />} />
              <Route path="/music" element={<Music />} />
              <Route path="/feed" element={<Feed />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/error" element={<Error />} />
              <Route path="/settings" element={<Settings/>}/>
            </Routes>
          )}
        </div>
      </div>
    </div>
  );
}
