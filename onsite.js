import {generateSignature, dataToString} from './onsite-utils'
  
  export const generateUUID = async (req, res) => {
    try {
        const passPhrase = req.headers['x-passphrase'];
        const environment = req.headers['x-environment'];

        var myData = req.body;
        
        myData["signature"] = generateSignature(myData, passPhrase);

        const pfParamString = dataToString(myData);

        var url = 'https://sandbox.payfast.co.za/onsite/process';

        if(environment === "production") {
            url = 'https://payfast.co.za/onsite/process';
        }

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
