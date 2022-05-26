const db = require('./db');
const helper = require('../helper');
const config = require('../config');

async function getMultiple(page = 1){
  const offset = helper.getOffset(page, config.listPerPage);
  const rows = await db.query(
    `SELECT * FROM Clubs LIMIT ${offset},${config.listPerPage}`
  );
  const data = helper.emptyOrRows(rows);
  const meta = {page};

  return {
    data,
    meta
  }
}

async function create(club){
  const result = await db.query(
    `INSERT INTO Clubs 
    (ClubId, Name, DefaultNumDesks, DateCreated) 
    VALUES 
    (${club.ClubId}, ${club.Name}, ${club.DefaultNumDesks}, ${new Date().toISOString().slice(0, 19).replace('T', ' ')})`
  );

  let message = 'Error in creating club';

  if (result.affectedRows) {
    message = 'Club created successfully';
  }

  return {message};
}

async function update(id, club){
  const datenow = new Date().toISOString().slice(0, 19).replace('T', ' ');
  const result = await db.query(
    `UPDATE Clubs SET Name="${club.name}", DefaultNumDesks=${club.DefaultNumDesks}, DateModified="${datenow}" WHERE ClubId=${id}` 
  );

  let message = 'Error in updating club';

  if (result.affectedRows) {
    message = 'Club updated successfully';
  }

  return {message};
}

async function remove(id){
  const result = await db.query(
    `DELETE FROM clubs WHERE id=${id}`
  );

  let message = 'Error in deleting club';

  if (result.affectedRows) {
    message = 'Club deleted successfully';
  }

  return {message};
}

module.exports = {
  getMultiple,
  create,
  update,
  remove
}