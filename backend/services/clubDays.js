const db = require('./db');
const helper = require('../helper');
const config = require('../config');
const ParseEmail = require('./nameParser.js');

async function getAll(){
    const rows = await db.query(
        `SELECT * FROM ClubDay`
    );
    const data = helper.emptyOrRows(rows);

    return {
        data
    }
}

async function getClubDayInfo(date, clubId) {
    var obj = await db.query(
        `SELECT ClubDayId FROM ClubDay WHERE Date LIKE "${date}" AND ClubId = "${clubId}"`
      );

    if (obj.length < 1) {
        var clubquery = await db.query(
            `SELECT DefaultNumDesks FROM Clubs WHERE ClubId = "${clubId}"`
          );
        let newClubDay = {
            ClubId: clubId,
            Date: date,
            NumDesks: clubquery[0].DefaultNumDesks,
        };
        await create(newClubDay);
        obj = await db.query(
            `SELECT ClubDayId FROM ClubDay WHERE Date LIKE "${date}" AND ClubId = "${clubId}"`
          );
    }  
    var clubDayId = obj[0].ClubDayId;

    var namesObj = await db.query(
        `SELECT Email, IsKeyholder, GuestName FROM Bookings WHERE Waitlist=0 AND ClubDayId = "${clubDayId}"`
      );

    var names = new Array();
    
    namesObj.forEach(row => {
        let name = "";
        if (row.GuestName !== null && row.GuestName !== "") {
            names.push(row.GuestName);
        } else {
            name = ParseEmail(row.Email);
            if (row.IsKeyholder == 1) {
                name += " - Keyholder";
            }
            names.push(name);
        }
    });

    const rows = await db.query(
        `SELECT ClubDayId, NumDesks, NumDesks - (SELECT COUNT(*) FROM Bookings WHERE Waitlist = 0 AND ClubDayId = "${clubDayId}") as DesksAvailable, Notice FROM ClubDay WHERE ClubDayId = ${clubDayId}`
      );

    var data = helper.emptyOrRows(rows);
    data.push(names);

    return { data }
}

async function create(clubDay){
  const result = await db.query(
    `INSERT INTO ClubDay 
    (ClubId, Date, NumDesks, Notice, DateCreated) 
    VALUES 
    (${clubDay.ClubId}, "${clubDay.Date}", ${clubDay.NumDesks}, null, "${new Date().toISOString().slice(0, 19).replace('T', ' ')}")`
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
  getClubDayInfo,
  create,
  update
}