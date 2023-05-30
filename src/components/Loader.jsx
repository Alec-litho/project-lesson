import classes from '../styles/loader.module.css'

export default function Loader() {//animation component
    return (
        <div className={classes.wait}>
            <div className={classes.ldsRoller}><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
        </div>
    )
}