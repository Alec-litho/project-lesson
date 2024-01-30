
import classes from './style/userPage.module.css';
import { ReactComponent as Arrow } from '../../assets/icons/arrow.svg'

export default function AboutMeBlock(props) {
    if(!props.isLoadedState) return null
    return (
        <div className={classes.aboutMeBlock}>
            <div className={classes.aboutMeHeader}> 

            </div>
            <div className={classes.gallery}>
                {props.galleryPhotos.map((image,indx) => {
                    if(indx>=6) return
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

