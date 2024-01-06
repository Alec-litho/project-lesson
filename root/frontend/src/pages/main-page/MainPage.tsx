import {useState, useEffect} from 'react';
import {fetchMyAlbums} from '../../features/albumSlice';
import Slider from '../../components/Slider';
import classes from './style/mainPage.module.css';
import PostBlock from './PostBlock';
import Loader from '../../components/Loader.jsx';
import Profile from './ProfileComponent.jsx';
import AboutMeBlock from './AboutMeBlock.jsx';
import {setToken} from "../../features/albumSlice"
import AdditionalInfoBlock from './AdditionalInfoBlock';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxCustomHooks';

export default function Main() {
    window.onbeforeunload = () => window.scrollTo(0, 0);
    const [isLoaded, setFinish] = useState(false);
    const [photos, setPhotos] = useState<IAlbumModel[]>([]);
    const dispatch = useAppDispatch();
    const auth = useAppSelector(state => state.auth);
    const albumState = useAppSelector(state => state.albums);
    const [sliderTrue, setSliderTrue] = useState<boolean>(false);
    const [currPictureId, setCurrPictureId] = useState<string | null>(null);//current img id to show in slider
    const [update, setUpdate] = useState(false);

    useEffect(() => {
        if(photos.length===0 && auth.userId){
            if(albumState.albums.length!==0 && albumState.userToken) {
                setPhotos([...albumState.albums]);
            }else {
                dispatch(fetchMyAlbums({_id:auth.userId,token:albumState.userToken})).then((res:any) => {
                    console.log(res);
                    setPhotos(res.payload);
                })
            }
            setFinish(true);
        };

    },[auth.userInfo])

    if(isLoaded === false) return <Loader/> 
    return (
        <div className={classes.mainpage}>
            <Profile fullName={auth.userInfo.fullName} age={auth.userInfo.age} friends={auth.userInfo.friends} avatarUrl={auth.userInfo.avatarUrl} location={auth.userInfo.location}/>
            <div className={classes.mainContent}>
                <AboutMeBlock galleryPhotos={photos} setSliderTrue={setSliderTrue} isLoadedState={isLoaded}/>
                <PostBlock  setCurrPictureId={setCurrPictureId} currPictureId={currPictureId} setSliderTrue={setSliderTrue}/>
            </div>
            <AdditionalInfoBlock/>
            {/*sidebar??*/}
            <Slider sliderTrue={sliderTrue} token={auth.userToken} setSliderTrue={setSliderTrue} currPictureId={currPictureId} setCurrPictureId={setCurrPictureId}></Slider>
        </div>
    );
}



