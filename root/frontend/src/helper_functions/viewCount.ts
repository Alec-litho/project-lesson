import { updateViewedMessages } from "../features/notificationsSlice";
import { fetchUserPosts, watched } from "../features/postSlice";
//to detect if user reached specific post to increase view count of the post, returns an index of the post that will be detected next

type currItemType = {
    itemId:string,
    watched:boolean,
    positionY:number,
}
interface viewCountProps {
  dispatch:any
  currItems:currItemType[] 
  viewedItems:number
  setViewedItems: (callback:(prev: number) => number | 0) => void 
  type:string
  parentObj: typeof window | HTMLDivElement
}


export default function viewCount({dispatch, currItems, viewedItems, setViewedItems, type, parentObj}:viewCountProps):void {
 
  if(currItems.length===0 || !currItems[viewedItems]) return
    let parentObjYPosition = getYPosition(parentObj)
    let item = currItems[viewedItems] 
    if(type==="post") {
      if(parentObjYPosition >= item.positionY && !currItems[viewedItems].watched) {
        currItems[viewedItems].watched = true
        dispatch(watched({id:item.itemId,token:"token"}))
        setViewedItems(prev => prev += 1);
      }
    } else if(type==="notification" && parentObj instanceof HTMLDivElement) {
      let bottomScrollPosition = parentObj.scrollHeight - parentObjYPosition - parentObj.clientHeight;
      if(bottomScrollPosition >= item.positionY && !currItems[viewedItems].watched) {
        console.log("notification was viewed")
        currItems[viewedItems].watched = true;
        dispatch(updateViewedMessages(currItems[viewedItems].itemId));
        setViewedItems(prev => prev += 1);
      }
    }
    function getYPosition(el:typeof window | HTMLElement) {
      if(el instanceof Window) {
        return el.scrollY
      } else {
        return el.scrollTop
      }
    }
}
