import React from 'react';
//home page
const Home = () => {
  return <h1>Home</h1>;
};

// export default Home;
// import React, { useState } from 'react';
// import './HomePage.css'; // Import your CSS file for styling

// const Home = () => {
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState('');

//   const handleSendMessage = () => {
//     if (newMessage.trim() !== '') {
//       const updatedMessages = [...messages, { text: newMessage, sender: 'user' }];
//       setMessages(updatedMessages);
//       setNewMessage('');
//     }
//   };

//   return (
//     <div className="chat-container">
//       <div className="message-list">
//         {messages.map((message, index) => (
//           <div key={index} className={`message ${message.sender}`}>
//             {message.text}
//           </div>
//         ))}
//       </div>
//       <div className="input-container">
//         <input
//           type="text"
//           placeholder="Type your message..."
//           value={newMessage}
//           onChange={(e) => setNewMessage(e.target.value)}
//         />
//         <button onClick={handleSendMessage}>Send</button>
//       </div>
//     </div>
//   );
// };

export default Home;
