import { useAppDispatch, useAppSelector } from "../hooks/reduxCustomHooks";
import { removeRecommendation } from "../features/postSlice";
import { Dispatch, SetStateAction } from "react";


export default function removeFromRecommendations(postId:string, posts:IPost[], setPosts:Dispatch<SetStateAction<IPost[]>>) {
    const dispatch = useAppDispatch();
    const user = useAppSelector(state => state.auth.userInfo);
    const filteredPosts = posts.filter(post => post._id !== postId) as IPost[];
    setPosts(filteredPosts);
    dispatch(removeRecommendation({postId, userId:user._id}))
}