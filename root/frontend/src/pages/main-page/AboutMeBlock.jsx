import { Link } from "react-router-dom"
import Gallery from "../gallery-page/Gallery"
import classes from './style/userPage.module.css';
import { ReactComponent as Arrow } from '../../assets/icons/arrow.svg'

export default function AboutMeBlock(props) {
    if(!props.isLoadedState) return null
    return (
        <div className={classes.aboutMeBlock}>
            <div className={classes.aboutMeHeader}> 

            </div>
            <div className={classes.gallery}>
                {props.galleryPhotos.map(album => {
                    if(album.name === 'All') {
                        return album.images.slice(0,8).map((photoObj, id) => {
                           return (<div className={classes.photoGallery} onClick={_ => props.setSliderTrue(true)} key={id}><img src={photoObj.imageURL}></img></div>)
                        })
                    }
                })}
                <div className={classes.arrowWrapper}>
                    <div className={classes.arrowBackground}></div>
                    <Arrow className={classes.showMoreArrow}/>
                </div>

            </div>
        </div>
    )
}

