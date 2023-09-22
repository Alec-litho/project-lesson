import "./App.css";
import { Route, Routes } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout, getCookie, fetchData } from "./features/authSlice";
import Dialog from "./pages/dialog-page/DialogPage";
import Main from "./pages/main-page/MainPage";
import Music from "./pages/music-page/MusicPage";
import Subscriptions from "./pages/subscriptions-page/SubscriptionsPage";
import Gallery from "./pages/gallery-page/Gallery";
import Login from "./pages/login-page/Login";
import Register from "./pages/register-page/Register";
import Header from "./components/Header";
import { useEffect } from "react";
// -----------------------------------------------//

export default function App() {
  const dispatch = useDispatch();
  const {isAuth, token, status} = useSelector((state) => state.auth);
  useEffect(() => {
    if(!isAuth) {
      dispatch(getCookie())
      .then(res => {
        if(res.payload.result && status !== 'error') dispatch(fetchData({...res.payload}));
      });
    };
  },[])
  if(status==='error') return <div>Error</div>
  return (
    <div>
      <div className="headerBackground">
        <div className="wrapper">
          <Header isAuth={isAuth} dispatch={dispatch} logout={logout} />
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
            </Routes>
          ) : (
            <Routes>
              <Route path="/dialogs" element={<Dialog />} />
              <Route path="/" element={<Main />} />
              <Route path="/music" element={<Music />} />
              <Route path="/subscriptions" element={<Subscriptions />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Routes>
          )}
        </div>
      </div>
    </div>
  );
}
