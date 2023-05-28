import { useEffect, useRef, useState } from "react"
import { ReactComponent as Arrow } from '../assets/icons/arrow.svg'
import { ReactComponent as Delete } from '../assets/icons/delete.svg'
import {deletePicture, fetchMyAlbums, fetchImg} from '../features/albumSlice'
import { useSelector, useDispatch } from "react-redux"
import Loader from "./Loader"
import axios from 'axios'
import '../styles/gallery_slider_style.css'

 
export default function Slider(props) {
    let leftArrow = useRef(null), rightArrow = useRef(null);
    let sliderContainer = useRef(null)
    let slider = useRef(null)
    let myData = useSelector(state => state.auth.data)
    let [pictures, setPictures] = useState([])
    let dispatch = useDispatch()
    console.log(pictures);
    function deleteImage(id) {
        dispatch(deletePicture({token: myData.token, id, update:props.setUpdate}))
        props.setSliderTrue(!props.sliderTrue)
    }
    useEffect(_ => {
        if(!props.currPictureId) return
        let headers = {headers: {'Content-Type': 'application/json',"Authorization": `Bearer ${myData.token}`}}
        axios.get(`http://localhost:3001/images/${props.currPictureId}`,headers)//get info of selected image and thus find out its album
            .then(res => {
                if(!res.data.album && !res.data.post) axios.get(`http://localhost:3001/images/${res.data._id}`,headers).then(res => setPictures([res.data])) 
                else if(res.data.post) {
                    console.log(props.currPictureId);
                    axios.get(`http://localhost:3001/posts/images`,{imgId:props.currPictureId},headers).then(res => setPictures([res.data.images])) 
                }
                else {axios.get(`http://localhost:3001/albums/${res.data.album}`,headers).then(res => setPictures(res.data.images))}
            })
    }, [props.currPictureId])
    function hideSlider(e) {
        if(e.target.className === 'imageContainer') {
            setPictures([])
            props.setSliderTrue(prev => prev = false)
        }
    }
    function sliderMoveForward(e) {
        let images = [...sliderContainer.current.childNodes]
        let curr = ''
        images.map((div, id) => {
            console.log(div);
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
        images[curr].className = 'img-cont-slider show' 
    }
    return (
        <div style={{"display": props.sliderTrue? "flex" : "none"}} ref={slider} className='slider'>
        <div className='imageContainer' ref={sliderContainer} onClick={e => hideSlider(e)}>
            {pictures.map((photo, id) => {
                if(!photo.album ) {//if image doesnt have album then show only one image
                    return <div key={id} className='img-cont-slider show'>
                                <div className='image-slider-header'><img className='img-slider' src={photo.imageURL}/></div>
                                <div className='comments-slider'>
                                    <div>{props.token & <Delete className="icon" onClick={_ => deleteImage(photo._id)}/>}</div>
                                    <p>{props.desc}</p>
                                </div>
                            </div>
                    }
                else if(pictures.length<=0) {
                    console.log('loa');
                    return  <div key={id} className='img-cont-slider show'>
                                <Loader/>
                                <div className='comments-slider'>
                                    <div>{props.token & <Delete className="icon" onClick={_ => deleteImage(photo._id)}/>}</div>
                                    <p>{props.desc}</p>
                                </div>
                            </div>
                }
                    return <div key={id} className={props.currPictureId === photo._id? 'img-cont-slider show' : 'img-cont-slider'} >
                                 <div className='image-slider-header'>
                                    <Arrow ref={leftArrow} className='arrowLeft' onClick={sliderMoveBackwards}/>
                                    <img className='img-slider' src={photo.imageURL} onClick={sliderMoveForward}/>
                                    <Arrow ref={rightArrow} className='arrowRight' onClick={sliderMoveForward}/>
                                 </div>
                                 <div className='comments-slider'>
                                     <div>
                                        {props.token & <Delete className="icon" onClick={_ => deleteImage(photo._id)}/>}
                                     </div>
                                     <p>{props.desc}</p>
                                 </div>
                             </div>
                })
            }
        </div> 
     </div>
    )
}