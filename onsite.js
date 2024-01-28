import {generateSignature, dataToString} from './onsite-utils'

const passPhrase = 'Itumeleng90s';
  
  export const generateUUID = async (req, res) => {
    try {
        var myData = req.body;
        
        myData["signature"] = generateSignature(myData, passPhrase);

        const pfParamString = dataToString(myData);

        const url = 'https://sandbox.payfast.co.za/onsite/process';

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
        console.log(uuid);

        // Send the UUID back to the client
        res.json({ uuid });
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        // Send an error response back to the client
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
