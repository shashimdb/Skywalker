import React, { useState } from 'react';
import Banner from "@leafygreen-ui/banner";
import { Link } from "@leafygreen-ui/typography";
import Card from "@leafygreen-ui/card";

import '../../css/Generic.css'; // Import your CSS file

interface Message {
  text: string;
  sender: string;
}

const RAG = () => {
  const [messages, setMessages] = useState<Message[]>([]);

  // Function to handle sending a message
  const sendMessage = () => {
    // Dummy function for now
    addMessage("User typed message");
  };

  // Function to add a new message to the conversation
  const addMessage = (message: string) => {
    setMessages(prevMessages => [...prevMessages, { text: message, sender: 'user' }]);
    // Add logic here to handle bot's response
  };

  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h1>RAG</h1>

        <br /> <br /> <br />

        <Card className="custom-card" style={{ display: 'inline-block', margin: 'auto', width: "90%" }}>
          <div id="chatContainer" style={{ maxHeight: '300px', overflowY: 'auto', padding: '10px', borderBottom: '1px solid #ccc' }}>
            {/* Render messages */}
            {messages.map((message, index) => (
              <div key={index} style={{ marginBottom: '10px', textAlign: message.sender === 'user' ? 'right' : 'left' }}>
                <div style={{ backgroundColor: message.sender === 'user' ? '#007bff' : '#f0f0f0', color: message.sender === 'user' ? '#fff' : '#000', padding: '8px 12px', borderRadius: '12px', maxWidth: '70%' }}>
                  {message.text}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Input for sending message */}
        <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'center' }}>
          <input type="text" style={{ width: '70%', padding: '8px', borderRadius: '20px', border: '1px solid #ccc', marginRight: '10px' }} />
          <button onClick={sendMessage} style={{ padding: '8px 16px', borderRadius: '20px', backgroundColor: '#007bff', color: '#fff', border: 'none', cursor: 'pointer' }}>Send</button>
        </div>
      </div>
    </div>
  );
};

export default RAG;
