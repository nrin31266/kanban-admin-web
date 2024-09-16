
export const replaceName = (str: string) => {
  return str
    .toLowerCase() 
    .normalize("NFD") 
    .replace(/[\u0300-\u036f]/g, "") 
    .replace(/\s+/g, "-") 
    .replace(/[^\w\-]+/g, "") 
    .replace(/-+/g, "-") 
    .trim(); 
};


export const replaceNameFile = (str: string) => {
  const lastDotIndex = str.lastIndexOf(".");
  const fileExtension = lastDotIndex !== -1 ? str.substring(lastDotIndex) : ""; 
  const fileName = lastDotIndex !== -1 ? str.substring(0, lastDotIndex) : str; 

  const cleanFileName = replaceName(fileName); 

  return `${cleanFileName}${fileExtension}`;
};
