import classes from './gallery.module.css'

import {useState, useEffect, useRef} from 'react'
import { ReactComponent as Plus } from '../../assets/icons/plus.svg'
import { useSelector, useDispatch} from 'react-redux'
import Slider from '../../components/Slider.tsx'
import Error from '../error-page/Error'
import {fetchUserAlbums, uploadImage} from '../../features/albumSlice'
import CreateModal from '../../components/Create_modal'
import postImage  from '../../helper_functions/postImage'
import Loader from '../../components/Loader'
import {useParams, redirect} from 'react-router-dom'


export default function Gallery() {
    const {id} = useParams()
    let auth = useSelector(state => state.auth);
    let [user, setUser] = useState(auth.userInfo)
    let token = useSelector(state => state.auth.userToken);
    let userAlbums = useSelector(state => state.albums);
    let dispatch = useDispatch()
    let addPicture = useRef(null), 
    underlines = useRef([<input value={'text'}/>])
    let [sliderTrue, setSliderTrue] = useState(false)
    let [closeModal, setModal] = useState(true)
    let [albums, setAlbums] = useState(userAlbums.albums[0]? userAlbums.albums : [])
    let [isLoaded, finishLoading] = useState(false)
    let [currentAlbum, setAlbum] = useState('All')
    let [currentAlbumId, setAlbumId] = useState(userAlbums.albums[0]? userAlbums.albums[0]._id : null)
    let [currPictureId, setCurrPictureId] = useState(null)
    let [updatePictures, setUpdate] = useState(false)


    useEffect(()=> { 

        if(userAlbums.status !== 'error') {
            if(albums.length===0 && userAlbums.albums.length===0) {
                dispatch(fetchUserAlbums({_id:id,token}))
                  .then(({payload}) => {
                        console.log(payload);
                        if(payload.statusCode===500) return 
                        setAlbumId(payload[0]._id);
                        if(Array.isArray(payload)) setAlbums([...payload]);
                        setUser(payload[0].user)
                  })
                } else if(albums.length===0 && userAlbums.albums.length!==0) {
                    setAlbums(userAlbums.albums[0])
                }
                finishLoading(true)
        } else {
            finishLoading(true)
        }
            
    },[updatePictures,albums,userAlbums])
    
    function showAlbum(e) {
        setAlbum(e.target.innerText)
        setAlbumId(e.target.dataset)
        if(e.target.parentNode.childNodes[0].innerText !== currentAlbum) {
            console.log(currentAlbum);
            [...e.target.parentNode.parentNode.childNodes].map(album => {
                if(album.id !== 'albums') return
                if(album.childNodes[0].innerText === currentAlbum) {
                   album.childNodes[0].style.backgroundColor = 'rgba(228, 232, 243, 0.822);' 
                   album.childNodes[0].style.paddingLeft = 20 + 'px'
                   album.childNodes[0].style.fontSize = 16 + 'px'
                } else{
                    e.target.parentNode.childNodes[0].style.backgroundColor = 'rgba(228, 232, 243, 0.822);' 
                    e.target.parentNode.childNodes[0].style.paddingLeft = 25 + 'px'
                    e.target.parentNode.childNodes[0].style.fontSize = 18 + 'px'
                }
            })
        } 
    }
    function showSlider(e) {
        console.log(e.target.dataset.id);
        setCurrPictureId(e.target.dataset.id)
        setSliderTrue(!sliderTrue)
    }
    function doAnimation(e) {e.target.childNodes.forEach(child => {
        underlines.current.forEach(item => item.id === child.id?  item.style.width = 200 + 'px' : null)
    })}
    function removeAnimation(e) {underlines.current.forEach(underline => underline.style.width = 100 + 'px')}

    function uploadPicture(e) {
        finishLoading(false)
        const albumId = currentAlbumId.albumid
        console.log(albumId);
        postImage(e.target, albumId, false/*is appended to post?*/ ).then(res => {
            dispatch(uploadImage({image:{...res,user:auth.userId},token})).then(({payload}) => {
                console.log(payload);
                const newAlbums = albums.map(album => {
                    if(album.name === currentAlbum){//find album where we should add image
                        const images = [...album.images,payload]//add image to images array in this album
                        return {...album, images}
                    }
                    return album
                })
                finishLoading(true)
                setAlbums(newAlbums)
            })
        })
    }

    if(isLoaded === false && userAlbums.albums.length===0) return <Loader/>
    if(userAlbums.status === "error") return <Error message={userAlbums.error.message} errorValue={userAlbums.error.value}/>
    return (
        <div className={classes.background}>
        <div className={classes.gallery}>
            <div className={classes.leftPanel}>
               <div className={classes.albums}>
                <div className={classes.leftPanelHeader}>
                    <h1>Albums</h1>
                    <img className={classes.userProfile} src={user.avatarUrl} onClick={() => redirect(`/user/${user._id}`)}></img>
                </div>
              
               {albums.map((album, indx) => {
                return (
                    <div id="albums" data-albumid={album._id} key={album._id} onClick={showAlbum} className={classes.album} onMouseEnter={doAnimation} onMouseMove={doAnimation} onMouseLeave={removeAnimation}>
                    <p data-albumid={album._id}>{album.name}</p>
                    <div ref={el => underlines.current[indx] = el}  id={id} className={classes.underline}><p></p></div>
                    </div>
                )
               })}
               {auth.userId===id && <Plus className={classes.addAlbum} onClick={() => setModal(!closeModal)}/>}
               
               </div>
            </div>
            <div className={classes.galleryBody}>
                    {
                        
                            albums.filter(a=>a._id===currentAlbumId)[0]?.length>0? 
                            albums.filter(a=>a._id===currentAlbumId)[0]?.images.map((photo, indx) => {
                                return (
                                <div  key={photo._id} className={classes.imgWrapper} onClick={e => showSlider(e)}>
                                   <img 
                                      data-id={photo._id} 
                                      date={photo.date} 
                                      title={photo.title} 
                                      className={classes.img} 
                                      src={photo.imageURL} 
                                      desc={photo.description}>
                                   </img>
                                </div>)
                            }) 
                            :
                            <div className={classes.emptyWrapper}>
                                <h1>Album is empty</h1>
                            </div>
                    }
                    {isLoaded === false? 
                        <Loader/>
                        :
                        auth.userId===id 
                    &&
                    <div className={classes.addPicture}>
                    <>
                       <label htmlFor="file-upload" className={classes.customUpload}><Plus className={classes.addPhoto}/></label>
                       <input className={classes.inputHide} id="file-upload" ref={addPicture} type="file" onInput={uploadPicture}/>
                    </>
                    </div>
                    }
                
            </div>
            <CreateModal closeModal={closeModal} setModal={setModal} userId={auth.userId} update={setUpdate} token={token} setAlbums={setAlbums}/>
            <Slider setUpdate={setUpdate} 
               token={token}   
               currentPictures={albums} 
               sliderTrue={sliderTrue} 
               setSliderTrue={setSliderTrue} 
               currPictureId={currPictureId}
               setCurrPictureId={setCurrPictureId}
            ></Slider>
        </div>
        </div>
    )
}


