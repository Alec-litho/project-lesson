
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
            </div>
            <div className={classes.gallery}>
                {props.galleryPhotos.length>0? props.galleryPhotos.map((image,indx) => {
                    if(indx>=4) return;
                    return <div className={classes.photoGallery} onClick={_ => props.setSliderTrue(true)} key={indx}>
                                <img src={image.imageURL}></img>
                            </div>
                })
                :
                <h3 style={{color:"gray", margin:"0 auto", paddingTop:"150px"}}>You haven't saved any photo yet</h3>
            
            }

            </div>
        </div>
    )
}

