import classes from "./feed.module.css";



export default function() {

    const posts = []

    return (
        <div className={classes.feedBody}>
            <div className={classes.leftSideContent}>

            </div>
            <div className={classes.mainContent}>
                {posts.map((post) => {

                })}
            </div>
            <div className={classes.rightSideContent}>

            </div>
        </div>
    )
}