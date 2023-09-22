import React, { useState } from "react";
import "./App.css";
import Chatbot from "./Components/Chatbot"; // Import the Chatbot component

function App() {
  const [isChatbotVisible, setIsChatbotVisible] = useState(false); // State to control chatbot visibility
  const [userName, setUserName] = useState(""); // State to store user name
  const [userEmail, setUserEmail] = useState(""); // State to store user name

  const handleStartChatbot = () => {
    setIsChatbotVisible(true);
  };
  const handleCloseChatbot = () => {
    setIsChatbotVisible(false);
  };



  return (
    <div className="app-container">
      <div className="left-container">
        <div className="about-chatbot">
          <h1>CHAT BOT - MeetUniversity</h1>
          <p>(powered by GPT-3.5 Turbo)</p>
          <i>Hint: Type anything in textfield and hit send button/enter. Hit clear button to clear chats.
        <br></br>Click Here To <a href="https://docs.google.com/document/d/1_UMI_fwUX_iwT4Dlp3Nuwmk1T_443X9NjiTaQjFJ36I/edit?usp=sharing">learn More</a></i>
        <h3>Please Enter Details</h3><input
            type="text"
            placeholder="Enter your name"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            required 
          />
          <input
            type="text"
            placeholder="Enter your Email"
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
          />
          <button onClick={handleStartChatbot}>Start Chatbot</button><br></br><br></br>
          <button onClick={handleCloseChatbot}>Close Chatbot</button>
        </div>
      </div>
      <div className="right-container">
        {isChatbotVisible && <Chatbot userName={userName} />}
      </div>
    </div>
  );
}

export default App;
