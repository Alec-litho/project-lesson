import {useState, useEffect} from 'react';
import {fetchMyAlbums} from '../../features/albumSlice';
import Slider from '../../components/Slider';
import classes from './style/userPage.module.css';
import PostBlock from './PostBlock';
import Loader from '../../components/Loader.jsx';
import Profile from './ProfileComponent.jsx';
import AboutMeBlock from './AboutMeBlock.jsx';
import AdditionalInfoBlock from './AdditionalInfoBlock';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxCustomHooks';
import {  useParams } from 'react-router-dom';
import { getUser } from '../../features/authSlice';

export default function User() {
    window.onbeforeunload = () => window.scrollTo(0, 0);
    const {id} = useParams()
    const auth = useAppSelector(state => state.auth);
    const albumState = useAppSelector(state => state.albums.albums);
    const dispatch = useAppDispatch();
    const [user, setUser] = useState<IUser>(auth.userInfo)
    const [albums, setAlbums] = useState<IAlbumModel[] | []>([])
    const [isLoaded, setFinish] = useState(false);
    const [photos, setPhotos] = useState<IAlbumModel[]>([]);
    const [sliderTrue, setSliderTrue] = useState<boolean>(false);
    const [currPictureId, setCurrPictureId] = useState<string | null>(null);//current img id to show in slider

console.log('w');

    useEffect(() => {
        if(albums!==undefined && user!==undefined) {
            console.log(id);
            
        if(id === auth.userId || id===undefined) {//if user enters his own page
            console.log(user);
            
            setUser(auth.userInfo)
            setAlbums(albumState)
        } else {//if its page of another user
            dispatch(getUser({_id:id,token:auth.userToken})).then(res => setUser(res.payload))
        }
        if(photos.length===0){
            if(albums.length!==0) {setPhotos([...albums])}
            else {
                const data = {_id: id === auth.userId? auth.userId : user._id, token:auth.userToken}
                dispatch(fetchMyAlbums(data)).then((res:any) => {
                    console.log(res);
                    res.error? setPhotos([]) : setPhotos(res.payload);
                    
                })
            }
            
        };
        setFinish(true);
    }
    },[id])
    console.log(user);
    
    if(isLoaded === false) return <Loader/> 
    return (
        <div className={classes.mainpage}>
           { user!==undefined && 
           <>
           <Profile fullName={user.fullName} age={user.age} friends={user.friends} avatarUrl={user.avatarUrl} location={user.location}/>
            <div className={classes.mainContent}>
                <AboutMeBlock galleryPhotos={photos} setSliderTrue={setSliderTrue} isLoadedState={isLoaded}/>
                <PostBlock  setCurrPictureId={setCurrPictureId} currPictureId={currPictureId} setSliderTrue={setSliderTrue} user={user}/>
            </div>
            <AdditionalInfoBlock/>
            {/*sidebar??*/}
            <Slider sliderTrue={sliderTrue} token={auth.userToken} setSliderTrue={setSliderTrue} currPictureId={currPictureId} setCurrPictureId={setCurrPictureId}></Slider></>
           
            }
        </div>
    );
}



