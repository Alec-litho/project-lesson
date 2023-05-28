import { ReactComponent as Delete } from '../assets/icons/delete.svg'
import { ReactComponent as Change } from '../assets/icons/change.svg'
import classes from '../styles/post.module.css'
import Slider from './Slider'
import { useState } from 'react'
export default function Post(props) {
  let [sliderTrue, setSliderTrue] = useState(false)
  let [currPictureId, setCurrPictureId] = useState(false)
    return (
        <div className={classes.post}>
        <div className={classes.postHeader}>
          <div><img className={classes.profileCircle} ></img></div>
          <div className={classes.date}>published on {props.date} {props.year} at {props.time}</div>
          <div className={classes.postTools}>
            <Delete className={classes.icon}/>
            <Change className={classes.icon}/>
          </div>
        </div>
        <div className={classes.text}>{props.text}</div>
          <div className={classes.images}>
            {props.images.map(img => {
              console.log(img);
              return <div className={classes.imgWrapper}><img data-id={img._id} className={classes.image} onClick={e => {
                setCurrPictureId(e.target.dataset.id)
                setSliderTrue(true)
              }} src={img.imageURL}></img></div>
            })
          }
          </div>
          <div className={classes.tools}>

          </div>
          <Slider sliderTrue={sliderTrue} setSliderTrue={setSliderTrue} currPictureId={currPictureId}/>
        </div>
    )
}