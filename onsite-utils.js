import crypto from 'crypto'

export const generateSignature1 = (data) => {
      return crypto.createHash("md5").update(data).digest("hex");
  };
  
  export const dataToString = (dataArray) => {
    // Convert your data array to a string
    let pfParamString = "";
    for (let key in dataArray) {
      if(dataArray.hasOwnProperty(key)){pfParamString +=`${key}=${encodeURIComponent(dataArray[key].trim()).replace(/%20/g, "+")}&`;}
    }
    // Remove last ampersand
    return pfParamString.slice(0, -1);
  };

  export const generateSignature = (data, passPhrase = null) => {
    // Create parameter string
    let pfOutput = "";
    for (let key in data) {
      if(data.hasOwnProperty(key)){
        if (data[key] !== "") {
          pfOutput +=`${key}=${encodeURIComponent(data[key].trim()).replace(/%20/g, "+")}&`
        }
      }
    }
  
    // Remove last ampersand
    let getString = pfOutput.slice(0, -1);
    if (passPhrase !== null) {
      getString +=`&passphrase=${encodeURIComponent(passPhrase.trim()).replace(/%20/g, "+")}`;
    }
  
      return crypto.createHash("md5").update(getString).digest("hex");
  }; 