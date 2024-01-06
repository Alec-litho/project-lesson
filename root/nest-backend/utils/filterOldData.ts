import { ImageDocument } from "src/image/entities/image.entity";
import { PostDocument } from "src/post/entities/post-entity";



export default function filterOldData(untilDaysNum:number/*num of days before data considered fresh*/,data:PostDocument | ImageDocument) {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth();
    const days = date.getDate();
    const monthsList = {"january":31,"february": year===2024||year===2028||year===2032? 29 : 28,"march": 31,"april":30,"may":31,"june":30,"july":31,"august":31,"september":30,"october":31,"november":30,"december":31}
    const dataTimeArr = data.createdAt.toString().split("-")
    const dataTime = [...dataTimeArr.slice(0,2), dataTimeArr[2].slice(0,2)]//["2024","01","05T16:24:46.720+00:00"] => ["2024","01","05"]
    if(dataTime[0]/*year*/ !== year.toString()) return false//if its last year then return false 
    const daysNow = Object.values(monthsList).reduce((prevMonth, currMonth, indx) => month <= indx? prevMonth + currMonth : 0,days);//2024.01.06 => 37
    const daysData = Object.values(monthsList).reduce((prevMonth, currMonth, indx) => {//2024.01.05 => 36
        const month = dataTime[1];
        const dataTimeToIndx = month[0]==="0"? Number(month[1])-1 : Number(month)-1;
        return dataTimeToIndx <= indx? prevMonth + currMonth : 0;
    },dataTime[2][0]==="0"?  Number(dataTime[2][1]) :  Number(dataTime[2]))
    return untilDaysNum >=  Math.abs((daysNow - daysData))? true : false 
}

