import {useState, useEffect} from 'react';
import {fetchUserAlbums} from '../../features/albumSlice';
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

export default function UserPage() { 

    const {id} = useParams()
    const auth = useAppSelector(state => state.auth);
    const albumState = useAppSelector(state => state.albums.albums);
    const dispatch = useAppDispatch();
    const [user, setUser] = useState<IUser>(auth.userInfo)
    const [album, setAlbum] = useState<IAlbumModel | null>(null)
    const [isLoaded, setFinishLoading] = useState(false);
    const [sliderTrue, setSliderTrue] = useState<boolean>(false);
    const [currPictureId, setCurrPictureId] = useState<string | null>(null);//current img id to show in slider
    console.log("update outside of useeffect",user);

    useEffect(() => {
        console.log("update in useeffect",id)
        if(auth.isAuth !== false && id!==undefined ) {
            if(id === auth.userId) {//if user enters his own page
                setUser(auth.userInfo)
                const mainAlbum = albumState.filter(album => album.name === 'All')
                if(mainAlbum.length===0)  setUserAlbum(auth.userInfo._id);
                else {
                    setAlbum(mainAlbum[0])
                    setFinishLoading(true);
                }
                
            } else {/*if its page of another user*/
                dispatch(getUser({_id:id,token:auth.userToken})).then(({payload}) => {
                    console.log(payload);
                    
                    setUser(payload)
                    setUserAlbum(payload._id)
                })
      
            }
        }  
    },[id, auth])


    function setUserAlbum(userId:string):void {
        const data = {_id: userId, token:auth.userToken}
        dispatch(fetchUserAlbums(data)).then((res:any) => {
            console.log(res); 
            setAlbum(res.payload.filter((album:IAlbumModel) => album.name === 'All')[0]);
            setFinishLoading(true);
        })
    }
    return (
        <>
         {isLoaded === false? <Loader/> 
            :
        <div className={classes.mainpage}>
           <>
            <Profile fullName={user.fullName} age={user.age} friends={user.friends} avatarUrl={user.avatarUrl} location={user.location} user={user}/>
            <div className={classes.mainContent}>
                <AboutMeBlock galleryPhotos={album?album.images:[]} setSliderTrue={setSliderTrue} isLoadedState={isLoaded}/>
                <PostBlock  setCurrPictureId={setCurrPictureId} currPictureId={currPictureId} setSliderTrue={setSliderTrue} user={user} />
            </div>
            <AdditionalInfoBlock/>
            <Slider sliderTrue={sliderTrue} token={auth.userToken} setSliderTrue={setSliderTrue} currPictureId={currPictureId} setCurrPictureId={setCurrPictureId}></Slider></>
        </div>
          }
        </>);
}



