const { Connection, Request, TYPES } = require("tedious");
const GetConnection = require('./initiateDbConnection.js');
const MURRAY_ID = 1;

module.exports = function CancelBooking(bookingDate, email) {
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
            (err) => {
                if (err) {
                    console.error(err.message);
                } else {
                    Delete(ClubDayId);
                }
            }
        );

        request.addParameter('bookingDate', TYPES.Date, bookingDate);
        request.addParameter('clubId', TYPES.Int, MURRAY_ID);
        request.addOutputParameter('Id', TYPES.Int);

        request.on('returnValue', (paramName, value) => {
            ClubDayId = value;
        });
        
        connection.execSql(request);
    }

    function Delete(ClubDayId) {
        var request = new Request(
            'DELETE FROM [dbo].[Bookings] WHERE ClubDayId = @clubDayId AND Email = @email',
            (err) => {
                if (err) {
                    console.error(err.message);
                }
                FindNextInQueue(ClubDayId);
            }
        );

        request.addParameter('clubDayId', TYPES.Int, ClubDayId);
        request.addParameter('email', TYPES.VarChar, email);

        connection.execSql(request);
    }

    function FindNextInQueue(ClubDayId) {
        var bookingId = -1;
        var request = new Request(
            'UPDATE [dbo].[Bookings] SET Waitlist = 0, DateModified = GETDATE() WHERE BookingId = (SELECT TOP 1 BookingId FROM [dbo].[Bookings] WHERE ClubDayId = @clubDayId AND Waitlist = 1 ORDER BY DateCreated ASC)',
            (err) => {
                if (err) {
                    console.error(err.message);
                }
                return; 
            }
        );

        request.addParameter('clubDayId', TYPES.Int, ClubDayId);

        connection.execSql(request);
    }

    connection.close();
    return;
}
