import trimTime from '../helper_functions/trimTime'

describe('trim time', () => {
  it('getage', () => {
    expect(getRecommendations(["politics","dogs","russia","food","streaming","singing","guitar"],["usa","animal","food","dogs"])).toBe(["food","dogs","usa","animal","politics","russia","streaming","singing","guitar"])
  })
})



function getRecommendations(user, post) {
  const postTags = post;
  const recommendations = user;
  const frequentlyAppearingWords = []
  const newWords = []
  for (let i = 0; i < postTags.length; i++) {
      let indx = recommendations.indexOf(postTags[i])
      if(indx!==-1) {
          frequentlyAppearingWords.push(postTags[i]); 
          recommendations.splice(indx,1)
      } else {
          newWords.push(postTags[i])
      }
      console.log(indx,recommendations);
    }
    console.log([...frequentlyAppearingWords, ...newWords, ...recommendations]);
  return [...frequentlyAppearingWords, ...newWords, ...recommendations]
}

