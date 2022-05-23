
import { useState } from 'react';
import './App.css';
import logo from './images/ADlogo.png';

function App() {

  const [email, setEmail] = useState('');

  const handleSubmit = () => {
    console.log(email)
  }

  return (
    <div className="App">

      <div className="login-container">
        <img src={logo}></img>

        <h1>Sign In</h1>

        <label htmlFor="email">Email Address</label>
        <input 
          type="text" 
          id="email" 
          placeholder="Example: john.smith@and.digital"
          onChange={ e => setEmail(e.target.value)}>
        </input>

        <button onSubmit={handleSubmit()}>Continue</button>
      </div>

    </div>
  );
}

export default App;
