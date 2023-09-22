function getAge(birthDate/*'2005-09-13'*/) {
    let date = birthDate.split('-').slice(1,3)
    let i = 0
    let currDate = new Date();
    
    let userAge = birthDate.split('-')[0];
    let age = currDate.getFullYear() - Number(userAge);
    const fullCurrDate = [currDate.getMonth()+1, currDate.getDate()];
    for (let j = 0; j < date.length; j++) {
        let fixedDate = date[j].length!==2? Number(date[j]) : date[j][0] === '0'? Number(date[j][1]) : Number(date[j]); //remove zero if it has one
        if(fixedDate > fullCurrDate[i]) {
            age--;
            break;
        }
        i++;
    }
    return Number(age);
}

module.exports = {
    getAge
}