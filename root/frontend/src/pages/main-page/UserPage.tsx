import {useState, useEffect} from 'react';
import {fetchMainAlbum, fetchUserAlbums} from '../../features/albumSlice';
import classes from './style/userPage.module.css';
import PostBlock from './PostBlock';
import Loader from '../../components/Loader.jsx';
import Profile from './ProfileComponent.jsx';
import AboutMeBlock from './AboutMeBlock.jsx';
import AdditionalInfoBlock from './AdditionalInfoBlock';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxCustomHooks';
import {  useParams } from 'react-router-dom';
import { getPossibleFriends, getUser } from '../../features/authSlice';
import { SetStateAction, Dispatch } from 'react';

type UserPage = {
    setSliderTrue: Dispatch<SetStateAction<boolean>>;
    sliderTrue: Boolean;
    setCurrPictureId: Dispatch<SetStateAction<string | null>>;
    currPictureId: string | null;
}

export default function UserPage({setSliderTrue, sliderTrue, currPictureId, setCurrPictureId}:UserPage) { 

    const {id} = useParams()
    const auth = useAppSelector(state => state.auth);
    const albumState = useAppSelector(state => state.albums);
    const dispatch = useAppDispatch();
    const [user, setUser] = useState<IUser>(auth.userInfo)
    const [album, setAlbum] = useState<IAlbumModel | null>(null)
    const [isLoaded, setFinishLoading] = useState(false);
    const [possibleFriends, setPossibleFriends] = useState<IUser[] | []>([])

    useEffect(() => {
        if(auth.isAuth !== false && id!==undefined ) {
            if(id === auth.userId) {//if user enters his own page
                dispatch(getPossibleFriends({id:auth.userId, token:auth.userToken})).then(({payload}) => Array.isArray(payload)? setPossibleFriends(payload  as IUser[]) : console.log(payload))
                setUser(auth.userInfo)
                const mainAlbum = albumState.albums.filter(album => album.name === 'All')
                if(mainAlbum.length===0)  setUserAlbum(auth.userInfo._id);
                else {
                    setAlbum(mainAlbum[0])
                    setFinishLoading(true);
                }
            } else {/*if its page of another user*/
                dispatch(getUser({_id:id,token:auth.userToken})).then(({payload}) => {
                    setUser(payload)
                    setUserAlbum(payload._id)
                })
      
            }
        }  
    },[id, auth])


    function setUserAlbum(userId:string):void {
        const data = {_id: userId, token:auth.userToken}
        dispatch(fetchMainAlbum(data)).then(({payload}) => {
            setAlbum(payload as IAlbumModel);
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
                <AboutMeBlock galleryPhotos={album?album.images:[]} setSliderTrue={setSliderTrue} isLoadedState={isLoaded} userId={user._id}/>
                <PostBlock  setCurrPictureId={setCurrPictureId} currPictureId={currPictureId} setSliderTrue={setSliderTrue} user={user} />
            </div>
            <AdditionalInfoBlock possibleFriends={possibleFriends} user={auth.userId} visitor={id}/>
            </>
        </div>
          }
        </>);
}



