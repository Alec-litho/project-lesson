import { fetchUserPosts, watched } from "../features/postSlice";
//to detect if user reached specific post to increase view count of the post, returns an index of the post that will be detected next

type currPostType = {
    postId:string,
    watched:boolean,
    positionY:number,
}
interface viewCountProps {
  dispatch:any
  currPosts:currPostType[]
  viewedPosts:number
  setViewedPosts: (callback:(prev: number) => number | 0) => void 
}

export default function viewCount({dispatch, currPosts, viewedPosts, setViewedPosts}:viewCountProps):void {

  if(currPosts.length===0 || !currPosts[viewedPosts]) return
  
    let post = currPosts[viewedPosts] 
    if(window.scrollY >= post.positionY && !currPosts[viewedPosts].watched) {
        currPosts[viewedPosts].watched = true
        dispatch(watched({id:post.postId,token:"token"}))
        setViewedPosts(prev => prev += 1);
    }
}
