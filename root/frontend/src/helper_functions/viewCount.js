import {fetchMyPosts, watched} from '../features/postSlice.ts'
//to detect if user reached specific post to increase view count of the post, returns an index of the post that will be detected next

export default function viewCount(auth, dispatch, currPosts, postToDetect) {
    if(currPosts.length===0 || !currPosts[postToDetect]) return
    let post = currPosts[postToDetect]
    if(window.scrollY >= post.positionY && !currPosts[postToDetect].watched) {
        console.log(post.postId, 'is watched', postToDetect, currPosts[postToDetect]);
        currPosts[postToDetect].watched = true
        dispatch(watched(post.postId))
        postToDetect += 1;
    }
    if(currPosts.length === postToDetect) {//if last post of current posts list is watched 
        dispatch(fetchMyPosts({postLength: currPosts.length,id:auth.userInfo._id}))//load another 10 posts
        postToDetect -= 1;
        console.log('10 posts watched');
    }
    return postToDetect
}