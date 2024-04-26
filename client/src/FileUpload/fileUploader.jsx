import React, { useState } from 'react';
import axios from 'axios';
import ChatInterface from '../ChatInterface/chatInterface';

export const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const [chat, setchat] = useState('');
  
  
  const [showChatInput, setShowChatInput] = useState(false);
  const [confirmChat, setConfirmChat] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    
    // Check if the selected file is a PDF
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setError(null); // Clear any previous error

      setShowChatInput(false); // Hide the chat input until user confirms
      setConfirmChat(false); 
    } else {
      setFile(null);
      setError('Please select a PDF file');
 
      setShowChatInput(false); // Hide the chat input until user confirms
      setConfirmChat(false); 
      
    }
    // setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:5000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      const {extracted_text}=response.data;
      setchat(extracted_text);
      alert('File uploaded successfully');
      const confirmChat = window.confirm('Do you want to start a chat with the bot?');
      if (confirmChat) {
        setShowChatInput(true); // Show the chat input if user confirms
        setConfirmChat(true); // Set confirmation flag
      }


    } catch (error) {
      console.error('Error uploading file:', error);
      setError('An error occurred while uploading the file');
      setShowChatInput(false); // Hide the chat input until user confirms
      setConfirmChat(false); 
    }
setError('')
  };

  return (
    <div style={{textAlign:'center' }} >
      <>
      <box style={{color:'Black'}} >
      <h1>Tax Gpt </h1>
      <h2>UPLOAD W2 FORM</h2>
      <h3><strong>only pdf file is uploded </strong></h3>
      <h4>first upload form then chat with bot </h4>
      </box>
      <box  >
      <input type="file" onChange={handleFileChange} style={{color:'black',margin:'4rem'}}/>
      </box>
      <button onClick={handleUpload}>Upload</button>
      {error && <div>{error}</div>}

      <>
      {showChatInput && <ChatInterface chat={chat}/>}
      {/* <ChatInterface chat={chat}/> */}
      <box style={{marginBottom:'9rem'} }></box>
      </>
      </>
    </div>
  );
};

export default FileUpload;
