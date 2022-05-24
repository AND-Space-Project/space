import React from 'react';
import { useState } from 'react';
import './styling/Login.css';
import logo from '../images/ADlogo.png';
import spacelogo from '../images/SPACE-Logo3.png';
import { ParseEmail } from '../services/nameParser.js';

function Login() {
    const [email, setEmail] = useState('');
    const fullName = ParseEmail(email);

    const handleSubmit = (e) => {
        console.log(fullName)
        console.log(email);
    }

    return(
        <div className='login'>

            <div className="login-container">
                <img src={spacelogo}></img>

                <h1>Sign In</h1>

                <label htmlFor="email">Email Address</label>
                <input 
                    type="text" 
                    id="email" 
                    placeholder="Example: john.smith@and.digital"
                    onChange={ e => setEmail(e.target.value)}>
                </input>

                <select name="Club" id="club">
                    <option value='1'>Club Murray</option>
                </select>

                <button onClick={handleSubmit()}>Continue</button>
                {
                email ? <p>Welcome {fullName}</p>
                :
                ''
                }
            </div>

        </div>
    )
}

export default Login;