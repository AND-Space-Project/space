const db = require('./db');
const helper = require('../helper');
const config = require('../config');

async function getAll(){
    const rows = await db.query(
        `SELECT * FROM ClubDay`
    );
    const data = helper.emptyOrRows(rows);

    return {
        data
    }
}

async function create(clubDay){
  const result = await db.query(
    `INSERT INTO ClubDay 
    (ClubId, Date, NumDesks, Notice, DateCreated) 
    VALUES 
    (${clubDay.ClubId}, "${clubDay.Date}", ${clubDay.NumDesks}, "${clubDay.Notice}", "${new Date().toISOString().slice(0, 19).replace('T', ' ')}")`
  );

  let message = 'Error in creating Club Day';

  if (result.affectedRows) {
    message = 'Club Day created successfully';
  }

  return {message};
}

async function update(id, notice, desks){
  const datenow = new Date().toISOString().slice(0, 19).replace('T', ' ');
  const result = await db.query(
    `UPDATE ClubDay SET NumDesks=${desks}, Notice="${notice}", DateModified="${datenow}" WHERE ClubDayId=${id}` 
  );

  let message = 'Error in updating Club Day';

  if (result.affectedRows) {
    message = 'Club Day updated successfully';
  }

  return {message};
}

module.exports = {
  getAll,
  create,
  update
}