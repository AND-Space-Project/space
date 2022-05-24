import React, { useState } from 'react';

function Calendar() {
    const [date, setDate] = useState('');
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
    
    return (
        <div>
            <input 
                type="date" 
                id="pickdate" 
                name="pickdate"
                min={today}
                max="2022-06-30"
            />
        </div>
  )
}

export default Calendar;
    

