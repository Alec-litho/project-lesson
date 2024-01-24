import classes from '../styles/loader.module.css'

export default function Loader() {//animation component
    return (
        <div className={classes.wait}>
            <span className={classes.loader}></span>
        </div>

    )
}