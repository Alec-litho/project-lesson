import { useEffect, useState } from "react";
import classes from "./feed.module.css";
import { useDispatch, useSelector } from "react-redux";
import { getRecommendations } from "../../features/postSlice";
import Post from "../../components/Post";
import { RootState } from "../../app/store";

export default function() {
    const user = useSelector((state:RootState) => state.auth)
    const [posts, setPosts] = useState([]);
    const dispatch = useDispatch();


    useEffect(() => {
        const postsOnThePage = posts.map((post:IPost)=>post._id)
        dispatch<any>(getRecommendations({userId: user.userId, postsOnThePage}))
    },[])

    return (
        <div className={classes.feedBody}>
            <div className={classes.leftSideContent}>

            </div>
            <div className={classes.mainContent}>
                {posts.map((post) => {
                    return <Post></Post>
                })}
            </div>
            <div className={classes.rightSideContent}>

            </div>
        </div>
    )
}