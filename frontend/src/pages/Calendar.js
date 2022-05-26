import React, { useState, useEffect } from 'react';
import './styling/Calendar.css';
import spacelogo from '../images/SPACE-Logo4.png';
import Login from './Login.js';
import UserInfo from '../services/UserInfo';
import Axios from 'axios';

function Calendar() {
    const [date, setDate] = useState('');
    const [click, setClick] = useState(false);
    const [keyholder, setKeyholder] = useState(false);
    
    const [clubData, setClubData] = useState(null);
    const userName = UserInfo.getFullName();
    const userEmail = UserInfo.getEmail();
    const userClub = UserInfo.getClubId();

    const currentDate = new Date();
    let day = currentDate.getDate();
    let month = currentDate.getMonth();
    const year = currentDate.getFullYear();

    let selectedDateInfo;
    const [avlDesks, setAvlDesks] = useState('');
    const [notice, setNotice] = useState('');
    const [names, setNames] = useState('');
    const [keyholderExists, setKeyholderExists] = useState('');
    const [createBookingLabel, setCreateBookingLabel] = useState('Create Booking');
    const [hideDeleteButton, setHideDeleteButton] = useState(true);

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
            //createBooking();
            populateInfo();
        }     

        const createBooking = () => {
            Axios.post('http://localhost:2000/bookings', {
                "ClubId": UserInfo.getClubId(),
                "Date": {date},
                "Email": UserInfo.getEmail(),
                "IsKeyHolder": false,
                "GuestName": "",
            }).then((response) => {
                console.log(response);
                populateInfo();
            });
        }

        const cancelBookings = () => {
            Axios.delete('http://localhost:2000/bookings', {
                "ClubId": UserInfo.getClubId(),
                "Date": {date},
                "Email": UserInfo.getEmail()
            }).then((response) => {
                console.log(response);
                populateInfo();
            });
        }

        const populateInfo = () => {
            Axios.get('http://localhost:2000/clubdays/'+UserInfo.getClubId()+'&'+date, {
            }).then((response) => {
                console.log(response);
                selectedDateInfo = response.data.data;
                setAvlDesks(selectedDateInfo['0'].DesksAvailable+"/"+selectedDateInfo['0'].NumDesks);
                setNotice(selectedDateInfo['0'].Notice);
                if (selectedDateInfo['0'].DesksAvailable < 1) {
                    setCreateBookingLabel("Join Waitlist");
                } else {
                    setCreateBookingLabel("Create Booking");
                }
                var namesList = new Array();
                var keyholder = "No";
                var existingBooking = false;
                selectedDateInfo['1'].forEach(n => {
                    namesList.push(n +"\n");
                    if (n.includes("Keyholder")) {
                        keyholder = "Yes";
                    }
                    if (n.includes(UserInfo.getFullName())) {
                        existingBooking = true;
                    }
                });
                setHideDeleteButton(!existingBooking);
                setNames(namesList);
                setKeyholderExists(keyholder);
            });
        }

        let open;
        if(click) {
            open =
            <div className='form'>
                <i onClick={showForm} class="fas fa-times fa-2x"></i>
                <p>Date selected: {date}</p>
                <p>Keyholder: {keyholderExists}</p>
                <p>Notices: {notice}</p>
                <p>Desks available: {avlDesks}</p>
                <p>{names}</p>
                <br></br>
                <button onClick={createBooking}>{createBookingLabel}</button>
                <button hidden={hideDeleteButton} onClick={cancelBookings}>Cancel all my bookings</button>
            </div>
        }

    return (
    <div className='calendar'>
        <div className='navbar'>
            <div className='welcomelabel'>
                <label>Welcome {userName} ({userEmail})</label>
            </div>
        </div>

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
    

