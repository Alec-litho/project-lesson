import classes from '../styles/post.module.css';
import { Dispatch, SetStateAction} from 'react';

interface DispatchToProps {
    action: () => void;
}
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


export default function ComponentMenu({type,showMenu,setShowMenu,visitor,author,deletePost,setEditPost,deleteComment,setEditComment,comment,post}:ComponentMenuType) {
    return (
        <div className={showMenu? classes.menuTools : classes.menuToolsHide} onMouseEnter={_ => setShowMenu(true)} onMouseLeave={_ => setShowMenu(false)}>
              {visitor._id === author._id?
                <div>
                  <a onClick={() => type==="comment"? (comment&&deleteComment)&&deleteComment(comment._id) : (post&&deletePost)&&deletePost(post._id)}>Delete</a>
                  <a onClick={() => type==="comment"? (comment&&setEditComment)&&setEditComment(comment._id) : (setEditPost)&&setEditPost(true)}>Edit</a>
                </div>
              :
              <>
                <a onClick={() => console.log('report')}>Report</a>
                <a onClick={() => /*removeFromRecommendations(post._id)*/ console.log('removeFromRecommendation')}>Hide from recom...</a>
              </>
              }
             
        </div>
    )
}