import { useEffect, useRef, useState  } from "react"
import { ReactComponent as Arrow } from '../assets/icons/arrow.svg'
import  Delete from '../assets/icons/delete'
import {deletePicture, fetchMyAlbums, fetchImg} from '../features/albumSlice'
import Loader from "./Loader"
import axios from 'axios'
import '../styles/gallery_slider_style.css'
import { Dispatch, SetStateAction } from "react";
import { useAppDispatch } from "../hooks/reduxCustomHooks"
import trimTime from "../helper_functions/trimTime"

type Islider = {
    setSliderTrue: Dispatch<SetStateAction<boolean>>;
    currPictureId: string | null;
    sliderTrue: boolean;
    setCurrPictureId: Dispatch<SetStateAction<string | null>>
    desc?: string;
    token: string
}
export default function Slider({setSliderTrue, currPictureId, sliderTrue,setCurrPictureId, desc,token}:Islider) {
    let sliderContainer = useRef<HTMLDivElement>(null)
    let slider = useRef(null)
    let [pictures, setPictures] = useState<ImageModel[] | []>([])
    let [imgIndx, setImgIndx] = useState<number>(0)
    let dispatch = useAppDispatch()
    function deleteImage(_id:string) {
        dispatch(deletePicture({_id,token}))
        setSliderTrue(!sliderTrue)
    }
    console.log(pictures,imgIndx);
    useEffect(() => {
        if(!currPictureId) return
        let headers = {headers: {'Content-Type': 'application/json',"Authorization": `Bearer ${token}`}}
        axios.get(`http://localhost:3001/image/${currPictureId}/true`,headers)//get info of selected image and thus find out if it has album
            .then(({data}) => {
                if(Array.isArray(data.value.album)&& !data.value.post) setPictures([data.value]);//if image is not stored in the post and album
                else if(data.value.album) setPictures(data.value.album.images);//if image is stored in the album
                else if(data.value.postId) { //if image is stored in the post
                    axios.get(`http://localhost:3001/image/postImgs/${data.value.postId}`).then(res => {
                        console.log(res);
                        setPictures(res.data)
                        setImgIndx(res.data.length===0? 0 : currPictureId!==null?res.data.map((img:any)=>img._id).indexOf(currPictureId) : 0)
                    })
                }
            })
        return () => setImgIndx(0)
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
        let curr = imgIndx
        curr = curr+1===images.length? 0 : curr+1
        setImgIndx(curr)
        images.forEach(elem => {if(elem instanceof Element) elem.className = 'img'})
        if(images[curr] instanceof Element) {
            let element = images[curr] as Element
            element.className = 'img show' 
        }   
    }
    function sliderMoveBackwards() {
        let images = sliderContainer.current? [...sliderContainer.current.childNodes] : [];
        let curr = imgIndx;
        curr--;
        setImgIndx(curr)
        images.forEach(elem => {if(elem instanceof Element) elem.className = 'img'});
        if(curr < 0) {
            curr = images.length-1;
            setImgIndx(curr)
            const elem = images[curr] as Element;
            elem.className = 'img show';
        } else {
            const elem = images[curr] as Element;
            elem.className = 'img show';
        }
    }
    function showArrow(e:any) {
        e.target.classList.add("show")
    }
    function removeArrow(e:any) {
        e.target.classList.remove("show")
    }
    return (
        <div style={{"display": sliderTrue? "flex" : "none"}} ref={slider} className='slider'>
        <div className='imageContainer' onClick={e => hideSlider(e)}>
                <div className={'img-cont-slider'} >
                    <div className='image-slider-header'>
                        <div className="left-arrow" onMouseOver={(e) => showArrow(e)} onMouseLeave={(e) => removeArrow(e)} onClick={sliderMoveBackwards}>
                            <Arrow className="arrow-icon"/>
                        </div>
                        <div className="img-slider" ref={sliderContainer}>
                            {pictures.map((photo, indx) => {
                                console.log(pictures,indx,imgIndx);
                                
                                return <img key={indx} className={indx===imgIndx? 'img show' : 'img'} src={photo.imageURL} onClick={sliderMoveForward}></img>
                                })
                            }
                        </div>
                        <div className="right-arrow" onMouseOver={(e) => showArrow(e)} onMouseLeave={(e) => removeArrow(e)} onClick={sliderMoveForward}>
                            <Arrow className="arrow-icon"/>
                        </div>
                    </div>
                    <div className='comments-slider'>
                        {pictures.map((image, indx) => {
                            if(indx === imgIndx) {
                                const profilePicture = image.user as IUser
                                return <div key={indx}>
                                    <div className="description-header">
                                        <img className="description-profilePicture" src={profilePicture.avatarUrl}></img>
                                        <p>{trimTime(image.createdAt)}</p>
                                    </div>
                                    <div className="description-body">
                                        <p>{image.description}</p>
                                    </div>
                                </div>
                            }
                        })}
                    </div>
                </div>
        </div> 
     </div>
    )
}
  