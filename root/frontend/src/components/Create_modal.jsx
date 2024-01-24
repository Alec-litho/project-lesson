import React, { useState, useRef } from "react";
import { useDispatch } from "react-redux";
import classes from "../styles/create_modal.module.css";
import { ReactComponent as Cross } from "../assets/icons/cross.svg";
import { uploadAlbum } from "../features/albumSlice";

export default function CreateModal({userId,update,token,setModal,closeModal,setAlbums}) {
  const [limit, setLimit] = useState(true);
  const [num, setNum] = useState(0);
  const dispatch = useDispatch();
  const descriptionTarget = useRef(null);
  const albumName = useRef(null);

  function createAlbum(e) {
    console.log(userId, albumName.current.value, descriptionTarget.current.value, token);
    const album = {user: userId, name: albumName.current.value, description: descriptionTarget.current.value? descriptionTarget.current.value : ''}
    if (limit) {
      dispatch(uploadAlbum({album, token}))
        .then(({payload}) => {
          console.log(payload);
          setAlbums(prev => [...prev,payload])
          descriptionTarget.current.value = "";
          albumName.current.value = "";
          setModal(prev => !prev);
        })

    }
  }
  function checkLimit(e) {
    setNum(e.target.value.length);
    e.target.value.length >= 250 ? setLimit(false) : setLimit(true);
  }
  return (
    <div
      className={
        closeModal ? classes.modal_background_closed : classes.modal_background
      }
    >
      <div className={classes.modal}>
        <div className={classes.header}>
          <h2>Create Album</h2>
          <Cross
            className={classes.cross}
            onClick={() => setModal(!closeModal)}
          />
        </div>
        <div className={classes.main}>
          <h1 className={classes.labelName}>Album`s name</h1>
          <input
            ref={albumName}
            type="text"
            id="name"
            className={classes.inputName}
          />
          <div className={classes.desc_block}>
            <h1 className={classes.labelDesc}>Album`s description</h1>
            <p className={limit ? classes.limit_false : classes.limit_true}>
              limit: 250/
              {num}
            </p>
            <textarea
              ref={descriptionTarget}
              onInput={(e) => checkLimit(e)}
              className={
                limit ? classes.description : classes.description_limit
              }
            />
          </div>
        </div>
        <button type="button" className={classes.btn} onClick={createAlbum}>
          Create
        </button>
      </div>
    </div>
  );
}
