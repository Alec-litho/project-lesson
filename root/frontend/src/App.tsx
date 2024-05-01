import "./App.css";
import { Route, Routes,redirect } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "./hooks/reduxCustomHooks";
import {getCookie, logout, getMe} from "./features/authSlice";
import Dialog from "./pages/dialog-page/DialogPage";
import UserPage from "./pages/main-page/UserPage";
import Music from "./pages/music-page/MusicPage";
import Feed from "./pages/feed-page/FeedPage";
import Gallery from "./pages/gallery-page/Gallery";
import Login from "./pages/login-page/Login";
import Register from "./pages/register-page/Register";
import Header from "./components/Header";
import Error from "./pages/error-page/Error"
import Settings from "./pages/settings-page/SettingsPage"
import Slider from './components/Slider';
import { useEffect, useState } from "react";
import { getNotificationMessages, setNewNotificationMessages } from "./features/notificationsSlice";
// -----------------------------------------------//

export default function App() {
  const queryString = window.location; 
  const userRouteId = queryString.pathname.split('/')[2]
  const dispatch = useAppDispatch();
  const {isAuth, userToken, userId, status, userInfo} = useAppSelector((state) => state.auth);
  const [sliderTrue, setSliderTrue] = useState<boolean>(false);
  const [currPictureId, setCurrPictureId] = useState<string | null>(null);//current img id to show in slider

  useEffect(() => {//connect to get notifications updates
    if(userId) {
      console.log('w', userId)
      const eventSource = new EventSource(`http://localhost:3001/notifications/listen_for/${userId}`);
      dispatch(getNotificationMessages({userId, messagesNum:0}));
      eventSource.onmessage = ({data}:{data:NotificationMessage[]}) => {
          dispatch(setNewNotificationMessages(data))
      }
    }
  },[userId]/*it supposed to invoke hook only 2 times*/)

  useEffect(() => {
    dispatch(getCookie())
    if(!isAuth && (userToken.length>0 && userId.length>0)) {
      if(status !== 'error') dispatch(getMe({_id:userId, token:userToken}));
    }
  },[userToken, userId])
  return (
    <div>
      <div className="headerBackground">
        <div className="wrapper">
          <Header avatarUrl={userInfo.avatarUrl} authId={userInfo._id} setSliderTrue={setSliderTrue} sliderTrue={sliderTrue} currPictureId={currPictureId} 
          setCurrPictureId={setCurrPictureId}
          />
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
            
              <Route path="/user/:id" element={<UserPage setSliderTrue={setSliderTrue} sliderTrue={sliderTrue} currPictureId={currPictureId} setCurrPictureId={setCurrPictureId}/>} />
              <Route path="/music" element={<Music />} />
              <Route path="/feed" element={<Feed setSliderTrue={setSliderTrue} sliderTrue={sliderTrue} currPictureId={currPictureId} setCurrPictureId={setCurrPictureId}/>} />
              <Route path="/gallery/:id" element={<Gallery />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/error" element={<Error />} />
              <Route path="/settings" element={<Settings/>}/>
              <Route path="/*" element={<Error />} />
            </Routes>
          )}
        </div>
      </div>
      <Slider sliderTrue={sliderTrue} token={userToken} setSliderTrue={setSliderTrue} currPictureId={currPictureId} setCurrPictureId={setCurrPictureId}></Slider>
    </div>
  );
}
