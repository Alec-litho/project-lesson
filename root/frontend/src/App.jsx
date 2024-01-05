import "./App.css";
import { Route, Routes,redirect } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getUser,getCookie, logout} from "./features/authSlice";
import Dialog from "./pages/dialog-page/DialogPage";
import Main from "./pages/main-page/MainPage";
import Music from "./pages/music-page/MusicPage";
import Feed from "./pages/feed-page/FeedPage";
import Gallery from "./pages/gallery-page/Gallery";
import Login from "./pages/login-page/Login";
import Register from "./pages/register-page/Register";
import Header from "./components/Header";
import Error from "./pages/error-page/Error"
import { useEffect } from "react";
// -----------------------------------------------//

export default function App() {
  const dispatch = useDispatch();
  const {isAuth, userToken, userId, status, error} = useSelector((state) => state.auth);
  useEffect(() => {
    console.log(status, error);
    if(!isAuth) {
      dispatch(getCookie())
      if(status !== 'error' && userToken.length !== 0) dispatch(getUser(userId));
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
              <Route path="/error" element={<Error />} />
            </Routes>
          ) : (
            <Routes>
              <Route path="/dialogs" element={<Dialog />} />
              <Route path="/" element={<Main />} />
              <Route path="/music" element={<Music />} />
              <Route path="/feed" element={<Feed />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/error" element={<Error />} />
            </Routes>
          )}
        </div>
      </div>
    </div>
  );
}
