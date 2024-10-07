import { message } from "antd";
import { storage } from "../firebase/firebaseConfig";
import { replaceNameFile } from "./replaceName";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import Resizer from "react-image-file-resizer";
const resizeFile = (file: any) =>
  new Promise((resolve) => {
    Resizer.imageFileResizer(
      file,
      1080,
      720,
      "JPEG",
      85,
      0,
      (newFile) => {
        return newFile;
      },
      "file"
    );
  });
export const uploadFile = async (f: any) => {
  const file: any = resizeFile(f);

  const fileName = replaceNameFile(file.name);

  const storageRef = ref(storage, `images/${fileName}`);

  const res = await uploadBytes(storageRef, file);

  if (res) {
    if (res.metadata.size === file.size) {
      return getDownloadURL(storageRef);
    } else {
      return "Uploading";
    }
  } else {
    message.error("Error upload!");
    return "Error upload";
  }
};

export const uploadFiles = async (files: any[]) => {
  const uploadPromises = files.map(async (f: any) => {
    const file: any = resizeFile(f);
    const fileName = replaceNameFile(file.name);
    const storageRef = ref(storage, `images/${fileName}`);

    const res = await uploadBytes(storageRef, file);
    if (res && res.metadata.size === file.size) {
      return getDownloadURL(storageRef);
    } else {
      throw new Error("Uploading error");
    }
  });

  try {
    const imagesUrl: string[] = await Promise.all(uploadPromises);
    return imagesUrl;
  } catch (error) {
    message.error("Error upload!");
    return null;
  }
};
