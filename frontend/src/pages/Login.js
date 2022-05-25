import React from 'react';
import { useState } from 'react';
import './styling/Login.css';
import spacelogo from '../images/SPACE-Logo3.png';
import Welcome from './Welcome';
import { Link } from 'react-router-dom';

function Login() {
    const [email, setEmail] = useState('');
    
    const handleSubmit = (e) => {
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
                    onChange={ e => setEmail(e.target.value)}
                    >   
                </input>

                <select name="Club" id="club">
                    <option value='1'>Club Murray</option>
                </select>

                <Link to='calendar'><button type="button">Continue</button></Link>
                <Welcome email={email}/>
                
            </div>

        </div>
    )
}


export default Login;