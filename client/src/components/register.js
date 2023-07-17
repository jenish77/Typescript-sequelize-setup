import React, { useState } from 'react';
import '../App.css';
// import '../Login.css'
import axios from 'axios';

function App() {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    user_name: '',
    mobile: '',
    email: '',
    password: '',
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/api/student/register', formData);
      console.log(response.data.message);
      console.log('Registration successful');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="App">
      <div className="container">
        <form onSubmit={handleSubmit}>
          <h2>Registration Form</h2>
          <label htmlFor="first_name">First Name:</label>
          <input
            type="text"
            id="first_name"
            name="first_name"
            required
            value={formData.first_name}
            onChange={handleInputChange}
          />

          <label htmlFor="last_name">Last Name:</label>
          <input
            type="text"
            id="last_name"
            name="last_name"
            required
            value={formData.last_name}
            onChange={handleInputChange}
          />

          <label htmlFor="user_name">Username:</label>
          <input
            type="text"
            id="user_name"
            name="user_name"
            required
            value={formData.user_name}
            onChange={handleInputChange}
          />

          <label htmlFor="mobile">Mobile:</label>
          <input
            type="text"
            id="mobile"
            name="mobile"
            required
            value={formData.mobile}
            onChange={handleInputChange}
          />

          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={formData.email}
            onChange={handleInputChange}
          />

          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            required
            value={formData.password}
            onChange={handleInputChange}
          />

          <input type="submit" value="Register" />
        </form>
      </div>
    </div>
  );
}

export default App;
