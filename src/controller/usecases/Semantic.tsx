import React, { useState } from 'react';
import Banner from "@leafygreen-ui/banner";
import { Link } from "@leafygreen-ui/typography";
import Card from "@leafygreen-ui/card";

import '../../css/Generic.css'; // Import your CSS file
import DataService from '../service/DataSerice';
import VStepper from '../vector/VStepper';
import { useSkywalker } from "../../hooks/useSkywalker";


interface Message {
  text: string;
  sender: string;
}

const Semantic = () => {
  const { ...todoActions } = useSkywalker();
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState('')
  const dataService = new DataService()
  // Function to handle sending a message
  const sendMessage = () => {
    // Convert to vector 
    // Dummy function for now
    addMessage(currentMessage);
  };

  // Function to add a new message to the conversation
  const addMessage = async (message: string) => {
    setMessages(prevMessages => [...prevMessages, { text: message, sender: 'user' }]);
    const embeddings = await dataService.getEmbeddings([currentMessage], "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")
    // Add logic here to handle bot's response
    const fetchData = async () => {
      try {
        const response = await todoActions.vectorSearch(embeddings[0], 'line_embedding', 'skywalkerIdx', 5);
        console.log(response)
        // Assuming response is an object with a "documents" array containing document objects
      } catch (error) {
        console.error("Error:", error);
      }
    };

    await fetchData()

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
          <input onChange={(e) => setCurrentMessage(e.target.value)} type="text" style={{ width: '70%', padding: '8px', borderRadius: '20px', border: '1px solid #ccc', marginRight: '10px' }} />
          <button onClick={sendMessage} style={{ padding: '8px 16px', borderRadius: '20px', backgroundColor: '#007bff', color: '#fff', border: 'none', cursor: 'pointer' }}>Send</button>
        </div>
      </div>
    </div>
  );
};

export default Semantic;
