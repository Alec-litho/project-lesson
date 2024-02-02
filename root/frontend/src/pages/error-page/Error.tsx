import React from "react";
import classes from './style/error.module.css';
import { useAppSelector } from "../../hooks/reduxCustomHooks";


export default function Error({message, errorValue}:{message?:string, errorValue?:any}) {
    const userId = useAppSelector(state => state.auth.userId)
    return (
        <div className={classes.errorBody}>
            <h1>{message?message : "Route is not found"}</h1>
            <h2>{errorValue?errorValue : "404"}</h2>
            <p>Return to the home page - <a href={`/user/${userId}`}>home</a></p>
        </div>
    )
}