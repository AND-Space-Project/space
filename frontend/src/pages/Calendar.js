import React, { useState } from 'react';
import './styling/Calendar.css';
import spacelogo from '../images/SPACE-Logo3.png';
import Login from './Login.js';

function Calendar() {
    const [date, setDate] = useState('');
    const [click, setClick] = useState(false);
    const [keyholder, setKeyholder] = useState(false);
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

        const showForm = () => {
            setClick(!click);
        }

        let open;
        if(click) {
            open =
            <div className='form'>
                <i onClick={showForm} class="fas fa-times fa-2x"></i>
                <p>Date selected: {date}</p>
                <p>Keyholder: <input type="checkbox" onClick={ () => setKeyholder(!keyholder)}></input></p>
                <p>Notices: </p>
                <p>Desks available:</p>
                <button>Create Booking</button>
            </div>
        }

    
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
                    value={date}
                />
            </div>
            <button id="select-date" onClick={showForm}>Select</button>
            { open }
        </div>
  )
}

export default Calendar;
    

