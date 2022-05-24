
import { useState } from 'react';
import './App.css';
import logo from './images/ADlogo.png';
import { ParseEmail } from './services/nameParser.js';

function App() {

  const [email, setEmail] = useState('ANDi@and.digital');
  const fullName = ParseEmail(email);

  const handleSubmit = (e) => {
    console.log(fullName)
    console.log(email);
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

        <button onClick={handleSubmit()}>Continue</button>
        {
          email ? <p>Welcome {fullName}</p>
          :
          ''
        }
      </div>

    </div>
  );
}

export default App;
