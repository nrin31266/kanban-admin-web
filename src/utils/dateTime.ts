import { message } from "antd";

export const isValidTimeRange = (start: Date, end: Date): boolean =>{
    console.log(start.getTime());
    console.log(end.getTime());
    if(start.getTime() >= end.getTime()){
        message.error('Time range invalid');
        return false;
    }
    return true;
}