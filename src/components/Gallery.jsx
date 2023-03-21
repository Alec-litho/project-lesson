import classes from '../style_modules/gallery.module.css'
import { ReactComponent as Arrow } from '../icons/arrow.svg'
import {useState, useEffect, useRef} from 'react'
import axios from 'axios'
import albums from '../data/myPictures/albums.json'
import { ReactComponent as AddPhoto } from '../icons/addPhoto.svg'

export default function Gallery(props) {
    let leftArrow = useRef(null),
    rightArrow = useRef(null),
    addPicture = useRef(null),
    underlines = useRef([<input value={'text'}/>]),
    slider = useRef(null)
    let [currentPictures, setPictures] = useState([])
    let [isLoaded, finishLoading] = useState(false)
    let [callfunc, setCallfunc] = useState(false)
    
    savePicture(currentPictures)
    useEffect(()=> {
        axios.post('http://localhost:3001/pictures').then(res => {

            setPictures(res.data)
            setCallfunc(true)
            finishLoading(true)
        }).catch(err => console.log(err))
        
    },[])

    function showAlbum() {
        setPictures()
    }
    function showSlider() {
        slider.current.style.display = 'flex'
    }
    function doAnimation(e) {e.target.childNodes.forEach(child => {
        underlines.current.forEach(item => item.id === child.id?  item.style.width = 200 + 'px' : null)
    })}
    function removeAnimation(e) {underlines.current.forEach(underline => underline.style.width = 100 + 'px')}

    function savePicture(picture) {
        return picture.length === 0? console.log('empty') : 
        axios.post('http://localhost:3001/pictures', JSON.stringify(picture)).catch(err => console.log(err))
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
                let date = new Date()
                let day = date.getDate()
                let month = date.getMonth() + 1
                setPictures(prev => [...prev, {name: imgName.slice(0, imgName.lastIndexOf('.')), displayURL: res.data.display_url  ,uploaded: day + '.' + month, year: date.getFullYear()}])
            })
        }
    }
    if(isLoaded === false) {
        return <Wait/>
        
    }
    return (
        <div className={classes.gallery}>

            <div className={classes.rightPanel}>
               <div className={classes.albums}>
               <h1>Albums</h1>
               {albums.map((album, id) => {
                return (
                    <div key={id} onClick={showAlbum} className={classes.album} onMouseEnter={doAnimation} onMouseMove={doAnimation} onMouseLeave={removeAnimation}>
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
                    currentPictures.map((photo, id) => {
                        return (<div key={id} className={classes.imgWrapper} onClick={showSlider}><img className={classes.img} src={photo.displayURL}></img></div>)
                    })
                    }
            </div>
            <div ref={slider} className={classes.slider}>
            <p></p>
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