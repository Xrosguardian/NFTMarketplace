//This contains all 2  functions pretaining to Pinata.js
//install axios library
// This will be a server component as we dont want anyone to acess our JWT
"use server"; // Ensure this is a server-side component for security

const axios = require('axios');
const jwt = process.env.JWT; // Securely use JWT from environment variables

// Function to upload JSON to IPFS
export const uploadJSONToIPFS = async (JSONbody) => {
  const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`; // Correct API endpoint
  try {
    // Sending a POST request to Pinata for JSON uploads
    const res = await axios.post(url, JSONbody, {
      headers: {
        Authorization: `Bearer ${jwt}`, // Use JWT for authentication
        'Content-Type': 'application/json', // Ensure correct content type
      },
    });

    // Return success if the upload worked
    return {
      success: true,
      pinataURL: "https://gateway.pinata.cloud/ipfs/" + res.data.IpfsHash, // Correct gateway
    };

  } catch (error) {
    console.error("Error uploading JSON to IPFS:", error.message);
    return {
      success: false,
      message: error.message, // Return a helpful error message
    };
  }
};

// Function to upload a file to IPFS
export const uploadFileToIPFS = async (data) => {
  const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`; // Correct API endpoint

  // Add metadata for the file (optional but recommended)
  const pinataMetadata = JSON.stringify({
    name: data.get('file').name, // Grab the file name from the form data
  });
  data.append("pinataMetadata", pinataMetadata); // Attach metadata

  // Add options for pinning (optional, depending on your use case)
  const pinataOptions = JSON.stringify({
    cidVersion: 0, // Ensure the CID version is set (default is 0)
  });
  data.append("pinataOptions", pinataOptions); // Attach options

  try {
    // Send the form data to Pinata for file uploads
    const res = await axios.post(url, data, {
      maxBodyLength: Infinity, // Ensure large files are allowed
      headers: {
        Authorization: `Bearer ${jwt}`, // Use JWT for authentication
        'Content-Type': `multipart/form-data`, // Ensure correct handling of multipart form-data
      },
    });

    // Return success if the upload worked
    return {
      success: true,
      pinataURL: "https://gateway.pinata.cloud/ipfs/" + res.data.IpfsHash, // Correct gateway
    };

  } catch (error) {
    console.error("Error uploading file to IPFS:", error.message);
    return {
      success: false,
      message: error.message, // Return a helpful error message
    };
  }
};
