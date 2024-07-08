export function passwordLengthWithStars(currPassword: string) {
    let result = "";
    for (let i = 0; i < currPassword.length; i++) {
      result += "*";
    }
    return result;
  }