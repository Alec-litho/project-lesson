import { useEffect, useRef, useState } from "react"
import { ReactComponent as Arrow } from '../assets/icons/arrow.svg'
import { ReactComponent as Delete } from '../assets/icons/delete.svg'
import {deletePicture, fetchMyAlbums, fetchImg} from '../features/albumSlice'
import { useSelector, useDispatch } from "react-redux"
import Loader from "./Loader"
import axios from 'axios'
import '../styles/gallery_slider_style.css'

 
export default function Slider({setSliderTrue, setUpdate, currPictureId, sliderTrue,setCurrPictureId, desc}) {
    let leftArrow = useRef(null), rightArrow = useRef(null);
    let sliderContainer = useRef(null)
    let slider = useRef(null)
    let [pictures, setPictures] = useState([])
    let token = useSelector(state => state.auth.token)
    let dispatch = useDispatch()
    function deleteImage(id) {
        dispatch(deletePicture({token, id, update:setUpdate}))
        setSliderTrue(!sliderTrue)
    }
    useEffect(_ => {
        console.log(currPictureId);
        if(!currPictureId) return
        let headers = {headers: {'Content-Type': 'application/json',"Authorization": `Bearer ${token}`}}
        axios.get(`http://localhost:3001/image/${currPictureId}/true`,headers)//get info of selected image and thus find out if it has album
            .then(({data}) => {
                console.log(data);
                if(Array.isArray(data.value.album)&& !data.value.post) setPictures([data.value]);//if image is not stored in the post and album
                else if(data.value.album) setPictures(data.value.album.images);//if image is stored in the album
                // else if(res.data.post) { //if image is stored in the post
                //     axios.post(`http://localhost:3001/posts/images`,{imgId:currPictureId},headers).then(res => {
                //         console.log(res);
                //         setPictures(res.data[0].images)
                //     })
                // }
                //if image is stored in the album
            })
    }, [sliderTrue])
    function hideSlider(e) {
        if(e.target.className === 'imageContainer') {
            setPictures([]);
            setSliderTrue(prev => prev = false);
            setCurrPictureId(null);
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
        images[curr].className = 'img-cont-slider show' 
    }
    return (
        <div style={{"display": sliderTrue? "flex" : "none"}} ref={slider} className='slider'>
        <div className='imageContainer' ref={sliderContainer} onClick={e => hideSlider(e)}>
            {pictures.map((photo, id) => {
                if(!photo.album && !photo.post) {//if image doesnt have album then show only one image
                    return <div key={id} className='img-cont-slider show'>
                                <div className='image-slider-header'><img className='img-slider' src={photo.imageURL}/></div>
                                <div className='comments-slider'>
                                    <div>{token & <Delete className="icon" onClick={_ => deleteImage(photo._id)}/>}</div>
                                    <p>{desc}</p>
                                </div>
                            </div>
                    }
                else if(pictures.length<=0) {
                    return  <div key={id} className='img-cont-slider show'>
                                <Loader/>
                                <div className='comments-slider'>
                                    <div>{token && <Delete className="icon" onClick={_ => deleteImage(photo._id)}/>}</div>
                                    <p>{desc}</p>
                                </div>
                            </div>
                }
                    return  <div key={id} className={currPictureId === photo._id? 'img-cont-slider show' : 'img-cont-slider'} >
                                 <div className='image-slider-header'>
                                    {/* <Arrow ref={leftArrow} className='arrowLeft' onClick={sliderMoveBackwards}/> */}
                                    <img className='img-slider' src={photo.imageURL} onClick={sliderMoveForward}/>
                                    {/* <Arrow ref={rightArrow} className='arrowRight' onClick={sliderMoveForward}/> */}
                                 </div>
                                 <div className='comments-slider'>
                                     <div>{token && <Delete className="icon" onClick={_ => deleteImage(photo._id)}/>}</div>
                                     <p>{desc}</p>
                                 </div>
                            </div>
                })
            }
        </div> 
     </div>
    )
}
