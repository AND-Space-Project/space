import React from 'react';
import { useState } from 'react';
import './styling/Login.css';
import logo from '../images/ADlogo.png';
import spacelogo from '../images/SPACE-Logo4.png';
import UserInfo from '../services/UserInfo';
import Welcome from './Welcome';
import { ParseEmail } from '../services/nameParser';
import { Link } from 'react-router-dom';

function Login() {
    const [email, setEmail] = useState('');
    const fullName = ParseEmail(email);
    const [clubId, setClubId] = useState(1);
    var disableButton = (fullName == 'ANDi');

    const inputEmail = (e) => {
        setEmail(e.target.value);
        UserInfo.setEmail(email);
        UserInfo.setClubId(clubId);
        UserInfo.setFullName(fullName);
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
                    onKeyUp={ inputEmail }>   
                </input>

                <select id="club" name="Club" value={clubId} onChange={ e => setClubId(e.target.value)}>
                    <option value='1'>Club Murray</option>
                    <option value='2'>Club Dekker</option>
                </select>

                <Link to='calendar'><button className="btn-main" type="button" disabled={disableButton}>Continue</button></Link>
                
            </div>

        </div>
    )
}


export default Login;