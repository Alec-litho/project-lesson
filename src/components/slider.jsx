import { useEffect, useRef } from "react"
import { ReactComponent as Arrow } from '../assets/icons/arrow.svg'
import { ReactComponent as Delete } from '../assets/icons/delete.svg'
import {deletePicture, fetchMyAlbums} from '../features/albumSlice'
import { useSelector, useDispatch } from "react-redux"
import axios from 'axios'

export default function Slider(props) {
    let leftArrow = useRef(null),
    rightArrow = useRef(null)
    let sliderContainer = useRef(null)
    let slider = useRef(null)
    let albums = useSelector(state => state.albums.albums)
    let myData = useSelector(state => state.auth.data)
    let dispatch = useDispatch()

    async function deleteImage(id) {
        await dispatch(deletePicture({token: myData.token, id, update:props.setUpdate}))
        props.setSliderTrue(!props.sliderTrue)
    }
    useEffect(_ => {
        [...sliderContainer.current.childNodes].map((img, id) => {
            img.className = id == props.currPictureId? 'img-cont-slider show' : 'img-cont-slider'
        })
    }, [])
    function hideSlider(e) {
        if(e.target.className === 'imageContainer') {
            props.setSliderTrue(!props.sliderTrue)
        }
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
    return (
        <div style={{"display": props.sliderTrue? "flex" : "none"}} ref={slider} className='slider'>
        <div className='imageContainer' ref={sliderContainer} onClick={e => hideSlider(e)}>
             {props.currentPictures.map(album => {
                 if(album.name === props.currentAlbum) {
                     return album.images.map((photo, id) => {
                     return <div key={id} className={id===0? 'img-cont-slider show' : 'img-cont-slider'} >
                                 <div className='image-slider-header'>
                                    <Arrow ref={leftArrow} className='arrowLeft' onClick={sliderMoveBackwards}/>
                                    <img className='img-slider' src={photo.imageURL} onClick={sliderMoveForward}/>
                                    <Arrow ref={rightArrow} className='arrowRight' onClick={sliderMoveForward}/>
                                 </div>
                                 <div className='comments-slider'>
                                     <div>
                                        <Delete className="icon" onClick={_ => deleteImage(photo._id)}/>
                                     </div>
                                     <p>{props.desc}</p>
                                 </div>
                             </div>
                    })}
             })}
        </div>
     </div>
    )
}