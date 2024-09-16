import { message } from "antd";
import { storage } from "../firebase/firebaseConfig";
import { replaceNameFile } from "./replaceName";
import {getDownloadURL, ref, uploadBytes}  from "firebase/storage";
export const uploadFile = async(file: any) => {
    const fileName = replaceNameFile(file.name);

    const storageRef = ref(storage, `images/${fileName}`);

    const res = await uploadBytes(storageRef, file);

    if(res){
        if(res.metadata.size === file.size){
            return getDownloadURL(storageRef);
        }else{
            return 'Uploading';
        }
        
    }else{
        message.error('Error upload!') 
        return 'Error upload';
    }
};