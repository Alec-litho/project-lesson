import classes from './gallery.module.css'
import './gallery_slider_style.css'
import { ReactComponent as Arrow } from '../../assets/icons/arrow.svg'
import {useState, useEffect, useRef} from 'react'
import axios from 'axios'
import { ReactComponent as AddPhoto } from '../../assets/icons/addPhoto.svg'
import { useSelector, useDispatch} from 'react-redux'
import Slider from '../../components/slider.jsx'
import {fetchMyAlbums, savePicture} from '../../features/albumSlice'

export default function Gallery(props) {
    let myData = useSelector(state => state.auth.data)
    let albums = useSelector(state => state.albums.albums)
    let dispatch = useDispatch()
    let leftArrow = useRef(null),
    rightArrow = useRef(null)
    let addPicture = useRef(null), 
    underlines = useRef([<input value={'text'}/>])
    let [sliderTrue, setSliderTrue] = useState(false)
    let [currentPictures, setPictures] = useState([])
    let [isLoaded, finishLoading] = useState(false)
    let [currentAlbum, setAlbum] = useState('All')
    let [currPictureId, setcurrPictureId] = useState(null)
    useEffect(()=> { 
        dispatch(fetchMyAlbums({userid: myData._id, token: myData.token}))//IT SHOULD UPDATE OTHERWISE COMPONENT DOESNT UPDATE AND DOESNT SHOW ALBUM
        setPictures(albums)
        finishLoading(true)
    },[setAlbum])
    
    function showAlbum(e) {
        setAlbum(e.target.innerText)

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
        setSliderTrue(!sliderTrue)
        setcurrPictureId(e.target.dataset.id)
    }
    function doAnimation(e) {e.target.childNodes.forEach(child => {
        underlines.current.forEach(item => item.id === child.id?  item.style.width = 200 + 'px' : null)
    })}
    function removeAnimation(e) {underlines.current.forEach(underline => underline.style.width = 100 + 'px')}

    function savePicture(picture) {
        dispatch(savePicture({picture, token: myData.token}))
    }
    function showArrows(e) {e.target.id === "left"? leftArrow.current.style.display = 'block' : rightArrow.current.style.display = 'block'}
    function hideArrows(e) {e.target.id === "left"? leftArrow.current.style.display = 'none' : rightArrow.current.style.display = 'none'}


    function uploadPicture(e) {
        let imgName = addPicture.current.value.slice(12)
        const rf = new FileReader();
        rf.readAsDataURL(addPicture.current.files[0])
        rf.onloadend = function (event) {
            const body = new FormData();
            body.append("image", event.target.result.split(",").pop()); 
            body.append("name", imgName.slice(0, imgName.lastIndexOf('.')));
            fetch('https://api.imgbb.com/1/upload?key=432e8ddaeeb70d2d1be863e87c0f354e', {
                method: "POST",
                body: body
            }).then(res => res.json()).then(res => {
                console.log(res)
                const currentImage = {title: imgName.slice(0, imgName.lastIndexOf('.')), imageURL: res.data.url, id: Math.random().toString(36), album:currentAlbum}
                savePicture(currentImage)
                setPictures(currentPictures)
            })
        }
    }
    if(isLoaded === false) return <Wait/>
    return (
        <div className={classes.background}>
        <div className={classes.gallery}>
            <div className={classes.rightPanel}>
               <div className={classes.albums}>
               <h1>Albums</h1>
               {currentPictures.map((album, id) => {
                return (
                    <div id="albums" key={id} onClick={showAlbum} className={classes.album} onMouseEnter={doAnimation} onMouseMove={doAnimation} onMouseLeave={removeAnimation}>
                    <p>{album.name}</p>
                    <div ref={el => underlines.current[id] = el}  id={id} className={classes.underline}><p></p></div>
                    </div>
                )
               })}
               </div>
               <div className={classes.addPicture}>
                  <label htmlFor="file-upload" className={classes.customUpload}><AddPhoto className={classes.addPhoto}/></label>
                  <input className={classes.inputHide} id="file-upload" ref={addPicture} type="file" onInput={uploadPicture}/>
               </div>
            </div>
            <div className={classes.galleryBody}>
               <Arrow ref={leftArrow} className={classes.arrowLeft}/>
               <Arrow ref={rightArrow} className={classes.arrowRight}/>
               <div id='left' className={classes.leftBorder} onMouseEnter={showArrows} onMouseLeave={hideArrows}></div>
               <div id='right' className={classes.rightBorder} onMouseEnter={showArrows} onMouseLeave={hideArrows}></div>
                    {
                    currentPictures.map((album, id) => {
                         if(album.name === currentAlbum) {
                            return album.images.map((photo, id) => {
                                return <div  key={id} className={classes.imgWrapper} onClick={e => showSlider(e)}><img data-id={id} date={photo.date} title={photo.title} className={classes.img} src={photo.imageURL} desc={photo.description}></img></div>
                            }) 
                         }
                    })
                    }
            </div>
            <Slider currentPictures={currentPictures} sliderTrue={sliderTrue} setPictures={setPictures} setSliderTrue={setSliderTrue} currPictureId={currPictureId} setcurrPictureId={setcurrPictureId} currentAlbum={currentAlbum}></Slider>
        </div>
        </div>
    )
}


function Wait() {//animation component
    return (
        <div className={classes.wait}>
            <div className={classes.ldsRoller}><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
        </div>
    )
}