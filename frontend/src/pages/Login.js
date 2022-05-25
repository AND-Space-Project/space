import React from 'react';
import { useState } from 'react';
import './styling/Login.css';
import logo from '../images/ADlogo.png';
import spacelogo from '../images/SPACE-Logo3.png';
import { ParseEmail } from '../services/nameParser.js';
import UserInfo from '../services/UserInfo';

function Login() {
    const [email, setEmail] = useState('');
    const fullName = ParseEmail(email);
    const [clubId, setClubId] = useState(1);

    const handleSubmit = (e) => {
        UserInfo.setEmail(email);
        UserInfo.setClubId(clubId);
        UserInfo.setFullName(fullName);
        console.log(UserInfo.getEmail());
        console.log(UserInfo.getClubId());
        console.log(UserInfo.getFullName());
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

                <select name="Club" value={clubId} onChange={ e => setClubId(e.target.value)}>
                    <option value='1'>Club Murray</option>
                    <option value='2'>Club Dekker</option>
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