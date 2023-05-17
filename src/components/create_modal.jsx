import classes from '../styles/create_modal.module.css'
import {ReactComponent as Cross} from '../assets/icons/cross.svg'
import { useDispatch, useSelector } from 'react-redux'
import {uploadAlbum} from '../features/albumSlice'
import { useState, useRef } from 'react'

export default function CreateModal(props) {
    let [limit, setLimit] = useState(true)
    let [num, setNum] = useState(0)
    let dispatch = useDispatch()
    let descriptionTarget = useRef(null)
    let albumName = useRef(null)
    function createAlbum(e) {
        if(limit) {
            dispatch(uploadAlbum({user:props.userId, name:albumName.current.value, desc: descriptionTarget.current.value, update:props.update, token:props.token}))
            descriptionTarget.current.value = ''
            albumName.current.value = ''
            props.setModal(prev => prev = !props.closeModal)
            
        } 
    }
    function checkLimit(e) {
        setNum(e.target.value.length)
        e.target.value.length >= 250? setLimit(false) : setLimit(true)
    }
    return (
        <div className={props.closeModal? classes.modal_background_closed : classes.modal_background}>
            <div className={classes.modal}>
                <div className={classes.header}>
                    <h2>Create Album</h2>
                    <Cross className={classes.cross} onClick={()=> props.setModal(!props.closeModal)}/>
                </div>
                <div className={classes.main}>

                    <label for="name" className={classes.labelName}>Album's name</label>
                    <input ref={albumName} type="text" id="name" className={classes.inputName}/>
                    <div className={classes.desc_block}>
                        <label for="desc" className={classes.labelDesc}>Album's description</label>
                        <p className={limit? classes.limit_false : classes.limit_true}>limit: 250/{num}</p>
                        <textarea ref={descriptionTarget} onInput={e => checkLimit(e)} className={limit?  classes.description : classes.description_limit}/>
                    </div>
                </div>
                <button className={classes.btn} onClick={createAlbum}>Create</button>
            </div>
        </div>
    )
}