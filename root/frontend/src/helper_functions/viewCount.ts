import { fetchUserPosts, watched } from "../features/postSlice";
//to detect if user reached specific post to increase view count of the post, returns an index of the post that will be detected next

type currPostType = {
    postId:string,
    watched:boolean,
    positionY:number,
}
interface viewCountProps {
  auth: IUser
  dispatch:any
  currPosts:currPostType[]
  viewedPosts:number
  setPosts: (callback:(prev: IPost[]) => IPost[]) => void
  setViewedPostsCount:(viewedPosts:number)=>void
  setLoader:(viewedPosts:boolean)=>void
}

export default function viewCount({auth, dispatch, currPosts, viewedPosts, setPosts,setViewedPostsCount, setLoader}:viewCountProps):number {
  if(currPosts.length===0 || !currPosts[viewedPosts]) return viewedPosts
    let post = currPosts[viewedPosts] 
    if(window.scrollY >= post.positionY && !currPosts[viewedPosts].watched) {
        console.log(post.postId, 'is watched', viewedPosts, currPosts[viewedPosts]);
        currPosts[viewedPosts].watched = true
        dispatch(watched({id:post.postId,token:"token"}))
        viewedPosts += 1;
    }
    if(currPosts.length === viewedPosts) {//if last post of current posts list is watched 
        dispatch(fetchUserPosts({_id:auth._id,token:'token',count: currPosts.length}))
          .then(({payload}:{payload:{posts:IPost[]}}) => {
            setPosts((prev:IPost[]) => [...prev,...payload.posts])
            console.log(payload.posts);
            dispatch(setViewedPostsCount(currPosts.length))
            setLoader(false)
          })
        viewedPosts -= 1;
    }
    return viewedPosts
}