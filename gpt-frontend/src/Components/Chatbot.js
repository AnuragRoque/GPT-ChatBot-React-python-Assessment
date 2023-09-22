import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Chatbot.css"; // Import the CSS for styling

const API_BASE_URL = "http://localhost:5000";

function Chatbot(props) {
  const [userInput, setUserInput] = useState("");
  const [conversation, setConversation] = useState([]);

  const handleUserInput = (event) => {
    setUserInput(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const response = await axios.post(`${API_BASE_URL}/ask`, {
      user_input: userInput,
    });

    const assistantResponse = response.data.assistant_response;

    setConversation([
      ...conversation,
      { role: "user", content: userInput },
      { role: "assistant", content: assistantResponse },
    ]);

    setUserInput("");
  };

  const handleClearChat = () => {
    setConversation([]);
  };

  useEffect(() => {
    // Greet the user when the chatbot component mounts
    setConversation([
      ...conversation,
      {
        role: "assistant",
        content: `Hello ${props.userName}, how can I help you?`,
      },
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="chat-container">
      <div className="chat-header">
        <div className="chat-title">Chatbot</div><br></br>
        <div className="clear-button" onClick={handleClearChat}>
          Clear
        </div>
      </div>
      <div className="chat-content">
        {conversation.map((message, index) => (
          <div
            key={index}
            className={`chat-bubble ${
              message.role === "user" ? "user-bubble" : "assistant-bubble"
            }`}
          >
            {message.content}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="chat-input-container">
        <input
          type="text"
          value={userInput}
          onChange={handleUserInput}
          placeholder="Type a message..."
          className="chat-input"
        />
        <button type="submit" className="send-button">
          Send
        </button>
      </form>
    </div>
  );
}

export default Chatbot;
