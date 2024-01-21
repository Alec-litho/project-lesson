import { useEffect, useRef, useState  } from "react"
// import { ReactComponent as Arrow } from '../assets/icons/arrow.svg'
import  Delete from '../assets/icons/delete'
import {deletePicture, fetchMyAlbums, fetchImg} from '../features/albumSlice'
import Loader from "./Loader"
import axios from 'axios'
import '../styles/gallery_slider_style.css'
import { Dispatch, SetStateAction } from "react";
import { useAppDispatch } from "../hooks/reduxCustomHooks"

type Islider = {
    setSliderTrue: Dispatch<SetStateAction<boolean>>;
    currPictureId: string | null;
    sliderTrue: boolean;
    setCurrPictureId: Dispatch<SetStateAction<string | null>>
    desc?: string;
    token: string
}
export default function Slider({setSliderTrue, currPictureId, sliderTrue,setCurrPictureId, desc,token}:Islider) {
    let leftArrow = useRef(null), rightArrow = useRef(null);
    let sliderContainer = useRef<HTMLDivElement>(null)
    let slider = useRef(null)
    let [pictures, setPictures] = useState<ImageModel[] | []>([])
    // let token = useSelector(state => state.auth.token)
    let dispatch = useAppDispatch()
    function deleteImage(_id:string) {
        dispatch(deletePicture({_id,token}))
        setSliderTrue(!sliderTrue)
    }
    useEffect(() => {
        console.log(currPictureId);
        if(!currPictureId) return
        let headers = {headers: {'Content-Type': 'application/json',"Authorization": `Bearer ${token}`}}
        axios.get(`http://localhost:3001/image/${currPictureId}/true`,headers)//get info of selected image and thus find out if it has album
            .then(({data}) => {
                console.log(data);
                if(Array.isArray(data.value.album)&& !data.value.post) setPictures([data.value]);//if image is not stored in the post and album
                else if(data.value.album) setPictures(data.value.album.images);//if image is stored in the album
                else if(data.value.postId) { //if image is stored in the post
                    axios.get(`http://localhost:3001/image/postImgs/${data.value.postId}`).then(res => {
                        console.log(res);
                        setPictures(res.data[0].images)
                    })
                }
            })
    }, [sliderTrue])
    function hideSlider(e:React.SyntheticEvent<HTMLElement>) {
        if(e.target instanceof Element === false) return 
        if(e.target.className === 'imageContainer') {
            setPictures([]);
            setSliderTrue(prev => prev = false);
            setCurrPictureId(null);
        }
    }
    function sliderMoveForward() {
        let images = sliderContainer.current? [...sliderContainer.current.childNodes] : []
        let curr = 0
        images.map((element, id:number) => {
            if(element instanceof Element) [...element.classList].forEach(elem => elem === 'show'? curr = id : null );
        })
        curr++
        images.forEach(elem => {if(elem instanceof Element) elem.className = 'img-cont-slider'})
        if(curr == images.length && images[curr] instanceof Element) {
            curr = 0
            let element = images[curr] as Element
            element.className = 'img-cont-slider show' 
    }
        
    }
    function sliderMoveBackwards() {
        let images = sliderContainer.current? [...sliderContainer.current.childNodes] : [];
        let curr = 0;
        images.map((elem, id) => {
            if(elem instanceof Element) [...elem.classList].forEach(elem => elem === 'show'? curr = id : null );
        });
        curr--;
        images.forEach(elem => {if(elem instanceof Element) elem.className = 'img-cont-slider'});
        if(curr < 0 && images[curr] instanceof Element) {
            curr = images.length-1;
            const elem = images[curr] as Element;
            elem.className = 'img-cont-slider show';
        }
    }
    return (
        <div style={{"display": sliderTrue? "flex" : "none"}} ref={slider} className='slider'>
        <div className='imageContainer' ref={sliderContainer} onClick={e => hideSlider(e)}>
            {pictures.map((photo, id) => {
                if(!photo.album && !photo.postId) {//if image doesnt have album then show only one image
                    return <div key={id} className='img-cont-slider show'>
                                <div className='image-slider-header'><img className='img-slider' src={photo.imageURL}/></div>
                                <div className='comments-slider'>
                                    <div>{token && ''/*<Delete className="icon" onClick={_ => deleteImage(photo._id)}/>*/}</div>
                                    <p>{desc}</p>
                                </div>
                            </div>
                    }
                else if(pictures.length<=0) {
                    return  <div key={id} className='img-cont-slider show'>
                                <Loader/>
                                <div className='comments-slider'>
                                    <div>{token && ''/*<Delete className="icon" onClick={_ => deleteImage(photo._id)}/>*/}</div>
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
                                     <div>{token && ''/*<Delete className="icon" onClick={_ => deleteImage(photo._id)}/>*/}</div>
                                     <p>{desc}</p>
                                 </div>
                            </div>
                })
            }
        </div> 
     </div>
    )
}
