const { Connection, Request, TYPES } = require("tedious");
const GetConnection = require('./initiateDbConnection.js');
const MURRAY_ID = 1;

module.exports = function CreateBooking(bookingDate, email, waitlist) {
    console.log(bookingDate + ", " + email + ", " + waitlist);
    connection = GetConnection();
    connection.connect(function(err) {
        if (err) {
          console.log('Connection Failed!');
          throw err;
        }

        FindClubDay();
    });

    function FindClubDay() {
        var ClubDayId = -1;
        var request = new Request(
            'SELECT TOP 1 @Id=ClubDayId FROM [dbo].[ClubDays] WHERE Date = @bookingDate',
            (err, rowCount, rows) => {
                if (err) {
                    console.error(err.message);
                } else {
                    if (rowCount > 0) {
                        console.log("Date Found");
                        console.log("ClubDayId = " + ClubDayId);
                        return;
                    }
                    else {
                        console.log("Date not found");
                        FindNumDesks();
                    }
                }
            }
        );
        request.addParameter('bookingDate', TYPES.Date, bookingDate);
        request.addOutputParameter('Id', TYPES.Int);
        
        request.on('returnValue', (paramName, value) => {
            ClubDayId = value;
        });
        
        connection.execSql(request);
    }

    function FindNumDesks() {
        var numDesks = -1;
        var request = new Request(
            'SELECT TOP 1 @numDesks=DefaultNumDesks FROM [dbo].[Clubs] WHERE ClubId = @clubId',
            (err, rowCount, rows) => {
                if (err) {
                    console.error(err.message);
                } else {
                    if (rowCount > 0) {
                        console.log("Club Found");
                        CreateClubDay(numDesks);
                    }
                    else {
                        console.log("Club not found");
                        return -1;
                    }
                }
            }
        );
        request.addParameter('clubId', TYPES.Int, MURRAY_ID);
        request.addOutputParameter('numDesks', TYPES.Int);
        
        request.on('returnValue', (paramName, value) => {
            numDesks = value;
        });
        
        connection.execSql(request);
    }

    function CreateClubDay(numDesks) {
        console.log("Lets create " + numDesks);

        var request = new Request(
            'INSERT INTO [dbo].[ClubDays] (ClubId, Date, NumDesks, DateCreated) VALUES (@clubId, @date, @numDesks, GETDATE())',
            (err) => {
                if (err) {
                    console.error(err.message);
                } else {
                    console.log("Created ClubDay");
                    FindClubDay();
                }
            }
        );
        request.addParameter('clubId', TYPES.Int, MURRAY_ID);
        request.addParameter('date', TYPES.Date, bookingDate);
        request.addParameter('numDesks', TYPES.Int, numDesks);
        
        connection.execSql(request);

    }
    return;
}
