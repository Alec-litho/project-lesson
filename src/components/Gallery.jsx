import classes from '../style_modules/gallery.module.css'
import { ReactComponent as Arrow } from '../icons/arrow.svg'
import {useState, useEffect, useRef} from 'react'
import axios from 'axios'
import albums from '../data/myPictures/albums.json'
let callfunc = false
export default function Gallery() {
    
    let leftArrow = useRef(null),
    rightArrow = useRef(null),
    addPicture = useRef(null),
    underlines = useRef([<input value={'text'}/>])
    let [currentPictures, setPictures] = useState(false)
    let [isLoaded, finishLoading] = useState(false)
    if(callfunc) savePicture(currentPictures)
    useEffect(()=> {
        fetchData()
        callfunc = true
    },[isLoaded])

    async function fetchData() {
        let data = await axios.get('http://localhost:3001/pictures').then(res => res.data)
        setPictures(data)
        finishLoading(true)
    }
    function doAnimation(e) {e.target.childNodes.forEach(child => {
        underlines.current.forEach(item => item.id === child.id?  item.style.width = 200 + 'px' : null)
    })}
    function removeAnimation(e) {underlines.current.forEach(underline => underline.style.width = 100 + 'px')}

    function savePicture(picture) {
        axios.post('http://localhost:3001/pictures', JSON.stringify(picture))
    }
    function showArrows(e) {e.target.id === "left"? leftArrow.current.style.display = 'block' : rightArrow.current.style.display = 'block'}
    function hideArrows(e) {e.target.id === "left"? leftArrow.current.style.display = 'none' : rightArrow.current.style.display = 'none'}


    async function uploadPicture(e) {
        let imgName = addPicture.current.value.slice(12)

        const rf = new FileReader();
        rf.readAsDataURL(addPicture.current.files[0])
        rf.onloadend = function (event) {
            const body = new FormData();
            body.append("image", event.target.result.split(",").pop()); 
            body.append("name", imgName.slice(0, imgName.lastIndexOf('.')));
            fetch('https://api.imgbb.com/1/upload?expiration=600&key=432e8ddaeeb70d2d1be863e87c0f354e', {
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
        console.log('wait');
        return <Wait/>
        
    }
    return (
        <div className={classes.gallery}>
            <div className={classes.rightPanel}>
               <h1>Albums</h1>
               <div className={classes.albums}>
               {albums.map((album, id) => {
                return (
                    <div key={id} className={classes.album} onMouseEnter={doAnimation} onMouseMove={doAnimation} onMouseLeave={removeAnimation}>
                    <p>{album.name}</p>
                    <div ref={el => underlines.current[id] = el}  id={id} className={classes.underline}><p></p></div>
                    </div>
                )
               })}
               </div>
               <div className={classes.addPicture}>
                  <input ref={addPicture}type="file" accept='image/png, image/jpg' onInput={uploadPicture}/>
               </div>
            </div>
            <div className={classes.galleryBody}>
               <Arrow ref={leftArrow} className={classes.arrowLeft}/>
               <Arrow ref={rightArrow} className={classes.arrowRight}/>
               <div id='left' className={classes.leftBorder} onMouseEnter={showArrows} onMouseLeave={hideArrows}></div>
               <div id='right' className={classes.rightBorder} onMouseEnter={showArrows} onMouseLeave={hideArrows}></div>
                    {
                    currentPictures.map((photo, id) => {
                        return <img src={photo.displayURL} key={id}></img>
                    })
                    }
            </div>
        </div>
    )
}

function Wait() {
    <div>Nothing is loaded yet</div>
}