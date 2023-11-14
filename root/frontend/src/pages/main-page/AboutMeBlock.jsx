import { Link } from "react-router-dom"
import Gallery from "../gallery-page/Gallery"
import classes from './mainPage.module.css';

export default function AboutMeBlock(props) {
    if(!props.isLoadedState) return null
    console.log(props.galleryPhotos);
    return (
        <div className={classes.aboutMeBlock}>
            <div className={classes.aboutMeHeader}> 
                <span>20 views</span>
                <Link to="/gallery" element={<Gallery/>}>See all</Link>
            </div>
            <div className={classes.gallery}>
                {props.galleryPhotos.map(album => {
                    if(album.name === 'All') {
                        return album.images.slice(0,8).map((photoObj, id) => {
                           return (<div className={classes.photoGallery} onClick={_ => props.setSliderTrue(true)} key={id}><img src={photoObj.imageURL}></img></div>)
                        })
                    }
                })}
            </div>
        </div>
    )
}

