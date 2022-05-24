const { Connection, Request, TYPES } = require("tedious");
const GetConnection = require('./initiateDbConnection.js');

module.exports = function CheckClubDayForBooking(bookingDate, email, clubId) {
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
            'SELECT TOP 1 @Id=ClubDayId FROM [dbo].[ClubDays] WHERE Date = @bookingDate AND ClubId = @clubId',
            (err, rowCount) => {
                if (err) {
                    console.error(err.message);
                } else {
                    if (rowCount > 0) {
                        console.log("Date Found");
                        FindBooking(ClubDayId);
                    } else {
                        console.log("Date not found");
                    }
                }
            }
        );

        request.addParameter('bookingDate', TYPES.Date, bookingDate);
        request.addParameter('clubId', TYPES.Int, clubId);
        request.addOutputParameter('Id', TYPES.Int);

        request.on('returnValue', (paramName, value) => {
            ClubDayId = value;
        });
        
        connection.execSql(request);
    }

    function FindBooking(ClubDayId) {
        var request = new Request(
            'SELECT * FROM [dbo].[Bookings] WHERE ClubDayId = @clubDayId AND Email = @email',
            (err, rowCount) => {
                if (err) {
                    console.error(err.message);
                } else {
                    if (rowCount > 0) {
                        console.log("User Bookings: " + rowCount);
                    } else {
                        console.log("No Bookings");
                    }
                }
            }
        );

        request.addParameter('clubDayId', TYPES.Int, ClubDayId);
        request.addParameter('email', TYPES.VarChar, email);
        
        connection.execSql(request);

    }

    connection.close();
}