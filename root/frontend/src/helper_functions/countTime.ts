

export const countTime = function(trimmedTime:string/*"Feb 24 2024 at 12:44:05"*/) {
    let resultTime = '';
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const date = new Date();
    const currTime = [
        date.getFullYear(), 
        date.getMonth()+1, 
        date.getDate(), 
        date.getHours(),
        date.getMinutes(),
        date.getSeconds(),
     ];
    const dateToCheck = trimmedTime.split(" ");
    const timeToCheck = dateToCheck[4].split(":")
    const toCheck = [
        dateToCheck[2]/*Years*/, 
        months.indexOf(dateToCheck[0])+1/*Months*/, 
        dateToCheck[1]/*Days*/, 
        timeToCheck[0]/*Hours*/, 
        timeToCheck[1]/*Minutes*/, 
        timeToCheck[2]/*Seconds*/, 
    ]
    const words = [
        ["year", "years"],
        ["month", "months"],
        ["day", "days"],
        ["hour", "hours"],
        ["minute", "minutes"],
        ["second", "seconds"], 
    ]
    for (let i = 0; i < toCheck.length; i++) {
        let timeAgo = (+currTime[i])-(+toCheck[i])//next date culc
        if( (+currTime[i+1])-(+toCheck[i+1])===0 && i>1) {break;}
        resultTime += timeAgo>1? ` ${Math.abs(timeAgo)} ${words[i][1]}` : ` ${Math.abs(timeAgo)} ${words[i][0]}`;
        
    }
    console.log(toCheck, currTime, resultTime)
    return resultTime;
}
