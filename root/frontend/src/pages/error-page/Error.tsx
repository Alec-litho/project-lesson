import React from "react";
import classes from './style/error.module.css';
import { useAppSelector } from "../../hooks/reduxCustomHooks";

export default function Error() {
    const error = useAppSelector(state => state.auth.error)
    
    return (
        <div className={classes.errorBody}>
            <h1>{error&&error.status}</h1>
            <h2>{error&&error.message}</h2>
            <p>Return to the home page - <a href="/">home</a></p>
        </div>
    )
}