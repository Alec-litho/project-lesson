

export default function countComments(comments:CommentModel[]) {
    return comments.reduce((prev,comment) => {
      let commentRepliesLeng = 0;
      const replies = comment.replies as CommentModel[]
      comment.replies.length===0? commentRepliesLeng += 1 : commentRepliesLeng += (countComments(replies)+1)
      return prev += commentRepliesLeng
    },0)
}

// export function commentsToOneArr(comments:CommentModel[]):any {
//   return comments.map((comment:CommentModel, indx:number) => {
//     console.log(indx);
    
//     let commentReplies:CommentModel[] | [] = [];
//     const replies = comment.replies as CommentModel[]
//     if(comment.replies.length!==0) commentReplies = [...commentReplies, ...commentsToOneArr(replies)]
//     return commentReplies
//     // return comments[indx-1]? [comments[indx-1], ...commentReplies] : commentReplies
    
//   })
// }