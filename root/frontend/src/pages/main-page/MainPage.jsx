import {useState, useEffect} from 'react';
import {useDispatch, useSelector } from 'react-redux';
import {fetchMyAlbums} from '../../features/albumSlice';
import Slider from '../../components/Slider.jsx';
import classes from './mainPage.module.css';
import PostBlock from './PostBlock.jsx';
import Loader from '../../components/Loader.jsx';
import Profile from './PofileComponent.jsx';
import AboutMeBlock from './AboutMeBlock.jsx';


export default function Main() {
    const [isLoaded, setFinish] = useState(false);
    const [photos, setPhotos] = useState([]);
    const dispatch = useDispatch();
    const auth = useSelector(state => state.auth);
    const userInfo = useSelector(state => state.auth.userInfo);
    const albums = useSelector(state => state.albums.albums);
    const [sliderTrue, setSliderTrue] = useState(false);
    const [currPictureId, setCurrPictureId] = useState(null);8//current img id to show in slider
    const [update, setUpdate] = useState(false);

    useEffect(() => {
        if(photos.length===0 && userInfo._id){
            if(albums.length!==0) setPhotos([...albums])
            else {
                dispatch(fetchMyAlbums({userid: userInfo._id, token: auth.token, update:setUpdate})).then((res) => {
                    setPhotos(res.payload);
                })
            }
        };
        if(userInfo._id) setFinish(true);
    },[userInfo,albums])

    if(isLoaded === false) return <Loader/> 
    return (
        <div className={classes.mainpage}>
            <Profile fullName={userInfo.fullName} age={userInfo.age} friends={userInfo.friends} avatarUrl={userInfo.avatarUrl} location={userInfo.location}/>
            <div className={classes.mainContent}>
                <AboutMeBlock galleryPhotos={photos} setSliderTrue={setSliderTrue} isLoadedState={isLoaded}/>
                <PostBlock  setCurrPictureId={setCurrPictureId} currPictureId={currPictureId} setSliderTrue={setSliderTrue} update={update} setUpdate={setUpdate} auth={auth}/>
            </div>
            {/*sidebar??*/}
            <Slider sliderTrue={sliderTrue} token={auth.token} setSliderTrue={setSliderTrue} currPictureId={currPictureId} setCurrPictureId={setCurrPictureId}></Slider>
        </div>
    );
}



