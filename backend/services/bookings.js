const db = require('./db');
const helper = require('../helper');
const config = require('../config');
const clubDays = require('./clubDays.js');

async function get(){
  const rows = await db.query(
    `SELECT * FROM Bookings`
  );
  const data = helper.emptyOrRows(rows);

  return {
    data
  }
}

async function create(bookingDetails){
  var obj = await clubDays.getClubDayInfo(bookingDetails.Date, bookingDetails.ClubId);
  var isWaitlist = (obj.data['0'].DesksAvailable < 1);

  const result = await db.query(
    `INSERT INTO Bookings 
    (ClubDayId, Email, Waitlist, IsKeyholder, GuestName, DateCreated) 
    VALUES 
    (${obj.data['0'].ClubDayId}, "${bookingDetails.Email}", ${isWaitlist}, ${bookingDetails.IsKeyholder}, "${bookingDetails.GuestName}", "${new Date().toISOString().slice(0, 19).replace('T', ' ')}")`
  );

  let message = 'Error in creating booking';

  if (result.affectedRows) {
    message = 'Booking created successfully';
  }

  return {message};
}

async function update(id){
  const datenow = new Date().toISOString().slice(0, 19).replace('T', ' ');
  const result = await db.query(
    `UPDATE Bookings SET Waitlist=0, DateModified="${datenow}" WHERE BookingId=${id}` 
  );

  let message = 'Error in updating booking';

  if (result.affectedRows) {
    message = 'Booking updated successfully';
  }

  return {message};
}

async function remove(bookingDetails){
  var obj = await clubDays.getClubDayInfo(bookingDetails.Date, bookingDetails.ClubId);

  var bookingsDeleted = await db.query(
    `SELECT COUNT(*) as BookingsDeleted FROM Bookings WHERE Waitlist = 0 AND ClubDayId = ${obj.data['0'].ClubDayId} AND Email LIKE "%${bookingDetails.Email}%"`
  );

  const result = await db.query(
    `DELETE FROM Bookings WHERE ClubDayId = ${obj.data['0'].ClubDayId} AND Email LIKE "%${bookingDetails.Email}%"`
  );

  let message = 'Error in deleting bookings';

  if (result.affectedRows) {
    message = 'Bookings deleted successfully';
    const bookingsToUpdate = await db.query(
        `SELECT BookingId FROM Bookings WHERE Waitlist = 1 AND ClubDayId = ${obj.data['0'].ClubDayId} ORDER BY DateCreated ASC`
      );
    for(i = 0; i < bookingsDeleted['0'].BookingsDeleted && i < bookingsToUpdate.length; i++) {
        update(bookingsToUpdate[i].BookingId);
    }
  }

  return {message};
}

module.exports = {
  get,
  create,
  update,
  remove
}