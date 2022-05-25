import React from 'react';
import { useState } from 'react';
import './styling/Login.css';
import logo from '../images/ADlogo.png';
import spacelogo from '../images/SPACE-Logo4.png';
import UserInfo from '../services/UserInfo';
import Welcome from './Welcome';
import { Link } from 'react-router-dom';

function Login() {
    const [email, setEmail] = useState('');
    const fullName = ParseEmail(email);
    const [clubId, setClubId] = useState(1);

    const inputEmail = (e) => {
        setEmail(e.target.value);
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
                    onChange={ inputEmail }>   
                </input>

                <select name="Club" value={clubId} onChange={ e => setClubId(e.target.value)}>
                    <option value='1'>Club Murray</option>
                    <option value='2'>Club Dekker</option>
                </select>

                <Link to='calendar'><button type="button">Continue</button></Link>
                <Welcome email={email}/>
                
            </div>

        </div>
    )
}


export default Login;