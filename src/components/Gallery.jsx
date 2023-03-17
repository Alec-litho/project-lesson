import classes from '../style_modules/gallery.module.css'
import photos from '../data/myPictures/photoData.json'
import { ReactComponent as Arrow } from '../icons/arrow.svg'
import {useState, useEffect, useRef} from 'react'
export default function Gallery() {
    let leftArrow = useRef(null)
    let rightArrow = useRef(null)
    function doAnimation(e) {e.target.childNodes[1].style.width = 200 + 'px'}
    function removeAnimation(e) {e.target.childNodes[1].style.width = 100 + 'px'}
    function showArrows(e) {e.target.id === "left"? leftArrow.current.style.display = 'block' : rightArrow.current.style.display = 'block'}
    function hideArrows(e) {e.target.id === "left"? leftArrow.current.style.display = 'none' : rightArrow.current.style.display = 'none'}
    return (
        <div className={classes.gallery}>
            <div className={classes.rightPanel}>
               <h1>Albums</h1>
               <div className={classes.albums}>
                  <div className={classes.album} onMouseEnter={doAnimation} onMouseLeave={removeAnimation}>
                  <p>Album name 1</p>
                  <div className={classes.underline}><p></p></div>
                  </div>
                  <div className={classes.album} onMouseEnter={doAnimation} onMouseLeave={removeAnimation}>
                  <p>Album name 2</p>
                  <div className={classes.underline}><p></p></div>
                  </div>
                  <div className={classes.album} onMouseEnter={doAnimation} onMouseLeave={removeAnimation}>
                  <p>Album name 3</p>
                  <div className={classes.underline}><p></p></div>
                  </div>
               </div>
            </div>
            <div className={classes.galleryBody}>
               <Arrow ref={leftArrow} className={classes.arrowLeft}/>
               <Arrow ref={rightArrow} className={classes.arrowRight}/>
               <div id='left' className={classes.leftBorder} onMouseEnter={showArrows} onMouseLeave={hideArrows}></div>
               <div id='right' className={classes.rightBorder} onMouseEnter={showArrows} onMouseLeave={hideArrows}></div>
               {photos.map(photo => {
                return <img src={require(`../data/myPictures/${photo.name}.jpg`)}></img>
               })}
            </div>
        </div>
    )
}