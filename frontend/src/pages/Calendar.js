import React, { useState } from 'react';
import './styling/Calendar.css';
import spacelogo from '../images/SPACE-Logo4.png';
import Login from './Login.js';
import UserInfo from '../services/UserInfo';

function Calendar() {
    const [date, setDate] = useState('');
    const userName = UserInfo.getFullName();
    const userEmail = UserInfo.getEmail();
    const userClub = UserInfo.getClubId();
    // const current = new Date();
    // const currentDate = `${current.getFullYear()}/${current.getMonth()+1}/${current.getDate()}`;

        const currentDate = new Date();
        let day = currentDate.getDate();
        let month = currentDate.getMonth();
        const year = currentDate.getFullYear();

        if (month < 10) {
            month = "0" + month
        }
        if (day < 10) {
            day = "0" + day
        }

        const today = year + "-" + month + "-" + day;

        let maxMonth = parseInt(month) + 2;
        if (maxMonth < 10) {
            maxMonth = "0" + maxMonth
        }
        let max = year + "-" + maxMonth + "-" + day;

    
    return (
        <div className='calendar'>

            <div className='calendar-img'>
                <img src={spacelogo}></img>
            </div>

            <div className='datepicker'>
                <h1>Select Date</h1>
                <input 
                    type="date" 
                    id="pickdate" 
                    name="pickdate"
                    min={today}
                    max={max}
                    onChange={ e => setDate(e.target.value)}
                />
            </div>
            
        </div>
  )
}

export default Calendar;
    

