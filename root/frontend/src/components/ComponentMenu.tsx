import classes from '../styles/menuComponent.module.css';
import { Dispatch, SetStateAction, useState} from 'react';
import { ReactComponent as Menu } from '../assets/icons/dots.svg';

type ComponentMenuType = {
  type: string
  showMenu: boolean
  setShowMenu: Dispatch<SetStateAction<boolean>>;
  visitor: IUser;
  author: IUser;
  deletePost?: (postId:string) => never
  setEditPost?: (bool:boolean) => never
  deleteComment?: (commentId:string) => never
  setEditComment?: (commentId:string) => never
  comment?: CommentModel
  post?: IPost
}


export default function ComponentMenu({type,visitor,author,deletePost,setEditPost,deleteComment,setEditComment,comment,post}:ComponentMenuType) {
  let [showMenu, setShowMenu] = useState(false);
  
  return (
    <div className={classes.postMenu}>
        <Menu className={classes.postMenuIcon} onMouseEnter={() => setShowMenu(true)} onMouseLeave={() => setShowMenu(false)}/>
        <div className={showMenu? classes.menuTools : classes.menuToolsHide} onMouseEnter={() => setShowMenu(true)} onMouseLeave={() => setShowMenu(false)}>
              {visitor._id === author._id?
                <div className={classes.authorMenu}>
                  <a onClick={() => type==="comment"? (comment&&deleteComment)&&deleteComment(comment._id) : (post&&deletePost)&&deletePost(post._id)}>Delete</a>
                  <a onClick={() => type==="comment"? (comment&&setEditComment)&&setEditComment(comment._id) : (setEditPost)&&setEditPost(true)}>Edit</a>
                </div>
              :
              <div className={classes.visitorMenu}>
                <a onClick={() => console.log('report')}>Report</a>
                <a onClick={() => /*removeFromRecommendations(post._id)*/ console.log('removeFromRecommendation')}>Hide from recom...</a>
              </div>
              }
             
        </div>
    </div>
    )
}