const db = require('./db');
const helper = require('../helper');
const config = require('../config');

async function get(){
  const rows = await db.query(
    `SELECT * FROM Bookings`
  );
  const data = helper.emptyOrRows(rows);

  return {
    data
  }
}

async function create(booking){
  const result = await db.query(
    `INSERT INTO Bookings 
    (ClubDayId, Email, Waitlist, IsKeyholder, GuestName, DateCreated) 
    VALUES 
    (${booking.ClubDayId}, "${booking.Email}", ${booking.Waitlist}, ${booking.IsKeyholder}, "${booking.GuestName}", "${new Date().toISOString().slice(0, 19).replace('T', ' ')}")`
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

async function remove(email){
  const result = await db.query(
    `DELETE FROM Bookings WHERE Email LIKE "%${email}%"`
  );

  let message = 'Error in deleting bookings';

  if (result.affectedRows) {
    message = 'Bookings deleted successfully';
  }

  return {message};
}

module.exports = {
  get,
  create,
  update,
  remove
}