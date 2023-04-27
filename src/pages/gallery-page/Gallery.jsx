import classes from './gallery.module.css'
import './gallery_slider_style.css'
import { ReactComponent as Arrow } from '../../assets/icons/arrow.svg'
import {useState, useEffect, useRef} from 'react'
import axios from 'axios'
import albums from '../../data/myPictures/albums.json'
import { ReactComponent as AddPhoto } from '../../assets/icons/addPhoto.svg'

export default function Gallery(props) {
    let leftArrow = useRef(null),
    rightArrow = useRef(null),
    addPicture = useRef(null),
    underlines = useRef([<input value={'text'}/>]),
    slider = useRef(null)
    let [currentPictures, setPictures] = useState([])
    let [isLoaded, finishLoading] = useState(false)
    let [currentAlbum, setAlbum] = useState()
    let sliderContainer = useRef(null)
    // savePicture(currentPictures)
    useEffect(()=> {
        axios.get('https://api.jsonbin.io/v3/b/643d5d2aebd26539d0acd9d4', {
            headers: {
                "X-MASTER-KEY": "$2b$10$y3p8j1CGw2n5ZUmWh4kE9OW8R.RqoGXrYo7Q7tlS2mAPj5SKqu.o2"
            }
        }).then(res => {
            setPictures(res.data.record)
            finishLoading(true)
        }).catch(err => console.log(err))
        
    },[])
    
    function showAlbum(e) {
        setAlbum(e.target.innerText)

        if(e.target.parentNode.childNodes[0].innerText !== currentAlbum) {
            console.log(currentAlbum);
            [...e.target.parentNode.parentNode.childNodes].map(album => {
                if(album.id !== 'albums') return
                if(album.childNodes[0].innerText === currentAlbum) {
                   album.childNodes[0].style.backgroundColor = 'white' 
                   album.childNodes[0].style.paddingLeft = 20 + 'px'
                   album.childNodes[0].style.fontSize = 16 + 'px'
                } else{
                    e.target.parentNode.childNodes[0].style.backgroundColor = 'rgb(233, 243, 255)' 
                    e.target.parentNode.childNodes[0].style.paddingLeft = 25 + 'px'
                    e.target.parentNode.childNodes[0].style.fontSize = 18 + 'px'
                }
            })
        } 
        
        
        
    }
    //---------------------------slider--------------------------------
    function hideSlider(e) {
        if(e.target.className === 'imageContainer') {
            slider.current.style.display = 'none'
        }
    }
    function showSlider(e) {
        slider.current.style.display = 'flex'
        console.log(e.target);
        [...sliderContainer.current.childNodes].map((img, id) => {
            img.className = id == e.target.dataset.id?'img-cont-slider show' : 'img-cont-slider'
            
        })
    }
    function sliderMoveForward(e) {
        let images = [...sliderContainer.current.childNodes]
        let curr = ''
        images.map((div, id) => {
            [...div.classList].forEach(elem => elem === 'show'? curr = id : null )
        })
        curr++
        images.forEach(elem => elem.className = 'img-cont-slider')
        if(curr == images.length) curr = 0
        images[curr].className = 'img-cont-slider show' 
        
    }
    function sliderMoveBackwards(e) {
        let images = [...sliderContainer.current.childNodes]
        let curr = ''
        images.map((div, id) => [...div.classList].forEach(elem => elem === 'show'? curr = id : null ))
        curr--
        images.forEach(elem => elem.className = 'img-cont-slider')
        if(curr < 0) curr = images.length-1
        console.log(curr);
        images[curr].className = 'img-cont-slider show' 
    }
    //---------------------------slider--------------------------------
    function doAnimation(e) {e.target.childNodes.forEach(child => {
        underlines.current.forEach(item => item.id === child.id?  item.style.width = 200 + 'px' : null)
    })}
    function removeAnimation(e) {
         underlines.current.forEach(underline => underline.style.width = 100 + 'px')
    }

    function savePicture(picture) {
        return picture.length === 0? console.log('empty') : 
        axios.put('https://api.jsonbin.io/v3/b/643d5d2aebd26539d0acd9d4', JSON.stringify(picture), {
            headers: {
                "Content-Type":"application/json",
                'X-MASTER-KEY': '$2b$10$y3p8j1CGw2n5ZUmWh4kE9OW8R.RqoGXrYo7Q7tlS2mAPj5SKqu.o2'
            }
        }).catch(err => console.log(err))
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
                currentPictures.map(album => {
                    if(album.name === currentAlbum) {
                        album.albumPhotos.push({name: imgName.slice(0, imgName.lastIndexOf('.')), displayURL: res.data.display_url  ,uploaded: day + '.' + month, year: date.getFullYear()})
                    }
                })
                console.log(currentPictures);
                setPictures(currentPictures)
                savePicture(currentPictures)
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
                            return album.albumPhotos.map((photo, id) => {
                                return <div  key={id} className={classes.imgWrapper} onClick={e => showSlider(e)}><img data-id={id} className={classes.img} src={photo.displayURL}></img></div>
                            }) 
                         }
                    })
                    }
            </div>
            <div ref={slider} className='slider'>
               <div className='imageContainer' ref={sliderContainer} onClick={e => hideSlider(e)}>
                    {currentPictures.map(album => {
                        if(album.name === currentAlbum) {
                            return album.albumPhotos.map((photo, id) => {
                            return <div key={id} className={id===0? 'img-cont-slider show' : 'img-cont-slider'} >
                                        <div className='image-slider-header'>
                                           <Arrow ref={leftArrow} className='arrowLeft' onClick={sliderMoveBackwards}/>
                                           <img className='img-slider' src={photo.displayURL} onClick={sliderMoveForward}/>
                                           <Arrow ref={rightArrow} className='arrowRight' onClick={sliderMoveForward}/>
                                        </div>
                                        <div className='comments-slider'>
                                            <div></div>
                                            <p>Cherry blossom foliage beautifully sweeping across your eyes as the setting sun glimmers off the pond. Lily pads seem to glow and the air is sweet like honey.  
*Update! Can't believe the Cherry Blossom Biome got announced for 1.20! I'll definitely be making another one once I'm able to play the official release.</p>
                                        </div>
                                    </div>
                            
                            }) 
                        }
                    })}
               </div>
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