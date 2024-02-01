import classes from './gallery.module.css'

import {useState, useEffect, useRef} from 'react'
// import { ReactComponent as AddPhoto } from '../../assets/icons/addPhoto.svg'
import { ReactComponent as Plus } from '../../assets/icons/plus.svg'
import { useSelector, useDispatch} from 'react-redux'
import Slider from '../../components/Slider.tsx'
import {fetchMyAlbums, uploadImage} from '../../features/albumSlice'
import CreateModal from '../../components/Create_modal'
import postImage  from '../../helper_functions/postImage'
import Loader from '../../components/Loader'
import { setToken } from '../../features/albumSlice'

export default function Gallery(props) {
    let auth = useSelector(state => state.auth);
    let token = useSelector(state => state.auth.userToken);
    let userAlbums = useSelector(state => state.albums.albums);
    let dispatch = useDispatch()
    let addPicture = useRef(null), 
    underlines = useRef([<input value={'text'}/>])
    let [sliderTrue, setSliderTrue] = useState(false)
    let [closeModal, setModal] = useState(true)
    let [albums, setAlbums] = useState(userAlbums[0]? userAlbums : [])
    let [isLoaded, finishLoading] = useState(false)
    let [currentAlbum, setAlbum] = useState('All')
    let [currentAlbumId, setAlbumId] = useState(userAlbums[0]? userAlbums[0]._id : null)
    let [currPictureId, setCurrPictureId] = useState(null)
    let [updatePictures, setUpdate] = useState(false)
    
    console.log(albums);
    useEffect(()=> { 
        // if((auth.userId && token)) {
            if(albums.length===0 && userAlbums.length===0) {
            dispatch(fetchMyAlbums({_id:auth.userId,token}))
              .then((res) => {
                console.log(res);
                setAlbumId(res.payload[0]._id);
                if(Array.isArray(res.payload)) setAlbums([...res.payload]);
              })
            } else if(albums.length===0 && userAlbums.length!==0) {
                setAlbums(userAlbums[0])
            }
            finishLoading(true)
        // }
    },[updatePictures,albums])
    
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

    if(isLoaded === false && userAlbums.length===0) return <Loader/>
    return (
        <div className={classes.background}>
        <div className={classes.gallery}>
            <div className={classes.leftPanel}>
               <div className={classes.albums}>
               <h1>Albums</h1>
               {albums.map((album, id) => {
                return (
                    <div id="albums" data-albumid={album._id} key={id} onClick={showAlbum} className={classes.album} onMouseEnter={doAnimation} onMouseMove={doAnimation} onMouseLeave={removeAnimation}>
                    <p data-albumid={album._id}>{album.name}</p>
                    <div ref={el => underlines.current[id] = el}  id={id} className={classes.underline}><p></p></div>
                    </div>
                )
               })}
                <Plus className={classes.addAlbum} onClick={() => setModal(!closeModal)}/>
               
               </div>
            </div>
            <div className={classes.galleryBody}>
                    {
                    albums.map((album, id) => {
                         if(album.name === currentAlbum) {
                            return album.images.map((photo, id) => {
                                return (
                                <div  key={id} 
                                className={classes.imgWrapper} 
                                onClick={e => showSlider(e)}>
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
                         }
                    })
                    }
                <div className={classes.addPicture}>
                    {isLoaded === false? 
                    <Loader/>
                    :
                    <>
                       <label htmlFor="file-upload" className={classes.customUpload}><Plus className={classes.addPhoto}/></label>
                       <input className={classes.inputHide} id="file-upload" ref={addPicture} type="file" onInput={uploadPicture}/>
                    </>
                    }
                  
               </div>
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


