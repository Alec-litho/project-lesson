import {useState, useEffect} from 'react';
import {useDispatch, useSelector } from 'react-redux';
import {Link} from 'react-router-dom';
import Gallery from '../gallery-page/Gallery.jsx';
import Dialog from '../dialog-page/DialogPage.jsx';
import {fetchMyAlbums, savePicture} from '../../features/albumSlice';
import Slider from '../../components/Slider.jsx';
import classes from './mainPage.module.css';
import PostBlock from './PostBlock.jsx';

export default function Main() {
    const [isLoaded, setFinish] = useState(false);
    const [photos, setPhotos] = useState([]);
    const dispatch = useDispatch();
    const auth = useSelector(state => state.auth);
    const userInfo = useSelector(state => state.auth.userInfo);
    const albums = useSelector(state => state.albums.albums);
    const [sliderTrue, setSliderTrue] = useState(false);
    const [currPictureId, setcurrPictureId] = useState(null);
    const [update, setUpdate] = useState(false);

    useEffect(() => {
        (function loadPhotos() {
            // dispatch(fetchData(auth.token))
            dispatch(fetchMyAlbums({userid: auth._id, token: auth.token, update:setUpdate}))
            setFinish(true)
            setPhotos(albums)
        })()
    },[])
    return (
        <div className={classes.mainpage}>
            <Profile fullName={userInfo.fullName} age={userInfo.age} friends={userInfo.friends} avatarUrl={userInfo.avatarUrl} location={userInfo.location}/>
            <div className={classes.mainContent}>
                <AboutMeBlock galleryPhotos={photos} setSliderTrue={setSliderTrue} isLoadedState={isLoaded}/>
                <PostBlock  setcurrPictureId={setcurrPictureId} setSliderTrue={setSliderTrue} update={update} setUpdate={setUpdate} auth={auth} savePicture={savePicture}/>
            </div>
            <Sidebar/>
            <Slider sliderTrue={sliderTrue} setSliderTrue={setSliderTrue} currPictureId={currPictureId}></Slider>
        </div>
    );
}
function Sidebar() {
    return (
        <div className={classes.sidebar}>
          
        </div>
    )
}
function Profile({avatarUrl, fullName, location, friends, age}) {
    // let profPicture = props.profilePicture? props.profilePicture : null
    return (
        <div className={classes.profileContainer}>
            <img src={avatarUrl} className={classes.pofilePicture}></img>
            <div className={classes.infoBlock}>
            <h1>{fullName}</h1>
            <div className={classes.defaultInfo}>
                <div className={classes.leftInfoBlock}>
                    <p>Location:</p>
                    <p>Friends:</p>
                    <p>Age:</p>
                </div>
                <div className={classes.rightInfoBlock}>
                    <a href="#">{location}</a>
                    <a href="#">{friends}</a>
                    <a href="#">{age}</a>
                </div>
            </div>
            <button className={classes.book}> <Link to="/dialogs" element={<Dialog/>}>Message</Link></button>
            <button className={classes.subscribe}>Subscribe</button>
           </div>
        </div>
    )
}
function AboutMeBlock(props) {
    if(!props.isLoadedState) return null
    return (
        <div className={classes.aboutMeBlock}>
            <div className={classes.aboutMeHeader}>
                <span>20 views</span>
                <Link to="/gallery" element={<Gallery/>}>See all</Link>
            </div>
            <div className={classes.gallery}>
                {props.galleryPhotos.map(album => {
                    if(album.name === 'All') {
                        return album.images.slice(0,8).map((photoObj, id) => {
                           return (<div className={classes.photoGallery} onClick={_ => props.setSliderTrue(true)} key={id}><img src={photoObj.imageURL}></img></div>)
                        })
                    }
                })}
            </div>
        </div>
    )
}


