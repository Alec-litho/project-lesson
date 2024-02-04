
import classes from './style/userPage.module.css';
import { ReactComponent as Arrow } from '../../assets/icons/arrow.svg'
import {useNavigate} from "react-router-dom"

export default function AboutMeBlock(props) {
    const navigate = useNavigate()
    if(!props.isLoadedState) return null
    return (
        <div className={classes.aboutMeBlock}>
            <div className={classes.aboutMeHeader}> 
            <a className={classes.goToGallery} onClick={() => {navigate(`/gallery/${props.userId}`)}}>go to the Gallery</a>
            <Arrow className={classes.goToGalleryArrow}/>
            </div>
            <div className={classes.gallery}>
                {props.galleryPhotos.map((image,indx) => {
                    if(indx>=4) return
                    return <div className={classes.photoGallery} onClick={_ => props.setSliderTrue(true)} key={indx}>
                                <img src={image.imageURL}></img>
                            </div>
                })}
                <div className={classes.arrowWrapper}>
                    <div className={classes.arrowBackground}></div>
                    <Arrow className={classes.showMoreArrow}/>
                </div>

            </div>
        </div>
    )
}

