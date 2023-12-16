import {useState, useEffect} from 'react';
import {useDispatch, useSelector } from 'react-redux';
import {fetchMyAlbums} from '../../features/albumSlice';
import Slider from '../../components/Slider.jsx';
import classes from './mainPage.module.css';
import PostBlock from './PostBlock.jsx';
import Loader from '../../components/Loader.jsx';
import Profile from './PofileComponent.jsx';
import AboutMeBlock from './AboutMeBlock.jsx';
import {getInitialState} from "../../features/albumSlice"

export default function Main() {
    window.onbeforeunload = () => window.scrollTo(0, 0);
    const [isLoaded, setFinish] = useState(false);
    const [photos, setPhotos] = useState([]);
    const dispatch = useDispatch();
    const auth = useSelector(state => state.auth);
    const albumState = useSelector(state => state.albums);
    const [sliderTrue, setSliderTrue] = useState(false);
    const [currPictureId, setCurrPictureId] = useState(null);8//current img id to show in slider
    const [update, setUpdate] = useState(false);

    useEffect(() => {
        if(photos.length===0 && auth.userInfo.userId){
            if(albumState.albums.length!==0 && albumState.userToken) {
                setPhotos([...albumState.albums]);
            }else {
                dispatch(getInitialState(auth.userToken))
                dispatch(fetchMyAlbums(auth.userId)).then((res) => {
                    setPhotos(res.payload);
                })
            }
            setFinish(true);
        };

    },[auth.userInfo,albumState])

    if(isLoaded === false) return <Loader/> 
    return (
        <div className={classes.mainpage}>
            <Profile fullName={auth.userInfo.fullName} age={auth.userInfo.age} friends={auth.userInfo.friends} avatarUrl={auth.userInfo.avatarUrl} location={auth.userInfo.location}/>
            <div className={classes.mainContent}>
                <AboutMeBlock galleryPhotos={photos} setSliderTrue={setSliderTrue} isLoadedState={isLoaded}/>
                <PostBlock  setCurrPictureId={setCurrPictureId} currPictureId={currPictureId} setSliderTrue={setSliderTrue} update={update} setUpdate={setUpdate} auth={auth}/>
            </div>
            {/*sidebar??*/}
            <Slider sliderTrue={sliderTrue} token={auth.token} setSliderTrue={setSliderTrue} currPictureId={currPictureId} setCurrPictureId={setCurrPictureId}></Slider>
        </div>
    );
}



