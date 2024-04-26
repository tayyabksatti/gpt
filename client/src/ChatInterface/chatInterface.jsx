import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ChatInterface = ({chat}) => {
  const [message, setMessage] = useState('');
  const [chatLog, setChatLog] = useState([]);
  console.log({chat})
  const [extractedText, setExtractedText] = useState('');
  useEffect(() => {
    if (chat) {
      setExtractedText(chat); // Assuming chat contains the extracted text
    }
  }, [chat]);
  const handleSendMessage = async () => {
    if (!message.trim()) {
      alert('Please enter a message');
      return;
    }

    const newChatLog = [...chatLog, { user: true, message }];
    setChatLog(newChatLog);
    // setMessage();

    try {
      const response = await axios.post('http://localhost:5000/question', {
        question: message,
        extracted_text: extractedText // Send extracted text along with the question
      });
      const botMessage = response.data.answer;
      const updatedChatLog = [...newChatLog, { user: false, message: botMessage }];
      setChatLog(updatedChatLog);
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      alert('An error occurred while sending the message');
    }
  };

  // const handleExtractedText = (text) => {
  //   setExtractedText(text);
  // };

  return (
    <>
    <div style={{textAlign:'center',margin:'2rem',background:'white',padding:'4rem',maxHeight:'150px', overflow: 'scroll' }} >
      <strong>hello feel free to ask question related to w2 form</strong>
      <div style={{textAlign:'center',margin:'2rem'}} >
        {chatLog.map((chat, index) => (
          <div key={index} style={{textAlign:'center',margin:'1rem'}}>
            {chat.user ? <strong>You: &nbsp;</strong>:<strong>&nbsp;Bot:&nbsp;</strong>} {chat.message}
          </div>
        ))}
      </div>
      <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} />
      <button onClick={handleSendMessage}>Send</button>
      
    </div>
    
    </>
  );
};

export default ChatInterface;
