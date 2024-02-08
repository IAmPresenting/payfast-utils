const crypto = require('crypto');
  
 const dataToString = (dataArray) => {
    // Convert your data array to a string
    let pfParamString = "";
    for (let key in dataArray) {
      if(dataArray.hasOwnProperty(key)){pfParamString +=`${key}=${encodeURIComponent(dataArray[key].trim()).replace(/%20/g, "+")}&`;}
    }
    // Remove last ampersand
    return pfParamString.slice(0, -1);
  };

const generateSignature = (data, passPhrase = null) => {
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
  
  const generateUUID = async (req, res) => {
    try {
        console.log("In Generate")
        const passPhrase = req.headers['x-passphrase'];
        console.log("headers: "+ passPhrase)
        var myData = req.body;
        console.log("body: "+ myData)
        myData["signature"] = generateSignature(myData, passPhrase);

        const pfParamString = dataToString(myData);

        var url = 'https://sandbox.payfast.co.za/onsite/process';

        /*if(environment === "production") {
            url = 'https://payfast.co.za/onsite/process';
        }*/

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: pfParamString
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();

        // Process the response data
        const uuid = data.uuid || null;

        // Send the UUID back to the client
        res.json({ uuid });
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        // Send an error response back to the client
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = { generateUUID };