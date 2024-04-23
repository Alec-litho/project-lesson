import { useEffect, useState } from "react";
import classes from "./feed.module.css";
import { useDispatch, useSelector } from "react-redux";
import { getRecommendations, setViewedPostsCount } from "../../features/postSlice";
import Post from "../../components/Post";
import { RootState } from "../../app/store";
import viewCount from "../../helper_functions/viewCount";
import Loader from "../../components/Loader";
import { SetStateAction, Dispatch } from 'react';
import removeFromRecommendations from "../../helper_functions/removeFromRecommendations";
type FeedPage = {
    setSliderTrue: Dispatch<SetStateAction<boolean>>;
    sliderTrue: Boolean;
    setCurrPictureId: Dispatch<SetStateAction<string | null>>;
    currPictureId: string | null;
}


export default function({setSliderTrue, sliderTrue, currPictureId, setCurrPictureId}:FeedPage) {
    const user = useSelector((state:RootState) => state.auth);
    // const newPosts = useSelector((state:RootState) => state.posts.posts);
    const [posts, setPosts] = useState<IPost[]>([]);
    const [loader, setLoader] = useState<Boolean>(true);
    let [currPosts, setCurrPosts] = useState<currPostType[] | []>([]);
    const dispatch = useDispatch();
    let viewedPosts = 0
    window.onscroll = () => viewedPosts = viewCount({user:user.userInfo, dispatch, currPosts, viewedPosts, setPosts, setViewedPostsCount, setLoader});

    console.log(posts)
    useEffect(() => {
        setLoader(true);
        setCurrPosts([]);
        const postsOnThePage = posts.map((post:IPost)=>post._id);
        dispatch<any>(getRecommendations({userId: user.userId, postsOnThePage}))
        .then(({payload}:{payload:{posts:IPost[]}}) => {
            console.log(payload)
            setPosts((prev) => [...prev,...payload.posts])
            setLoader(false)
          });
    },[])

    return (
        <div className={classes.feedBody}>
            <div className={classes.leftSideContent}> 

            </div>
            <div className={classes.mainContent}>
                {posts.map((post) => {
                     return <Post key={post._id} author={user} visitor={user.userInfo} post={post}setCurrPosts={setCurrPosts}setSliderTrue={setSliderTrue}token={"token"} 
                     setCurrPictureId={setCurrPictureId} currPictureId={currPictureId} removeFromRecommendations={removeFromRecommendations} setPosts={setPosts}
                     />
                })}
            </div>
            <div className={classes.rightSideContent}>

            </div>
            {loader? <Loader></Loader> : <div style={{"height":"100px"}}/*without this user cant scroll last post to the top of the screen to make it viewed*//>}
        </div>
    )
}