

export default function countComments(comments:CommentModel[]) {
    return comments.reduce((prev,comment) => {
      let commentRepliesLeng = 0;
      const replies = comment.replies as CommentModel[]
      comment.replies.length===0? commentRepliesLeng += 1 : commentRepliesLeng += (countComments(replies)+1)
      console.log(prev, comment);
      return prev += commentRepliesLeng
    },0)
}