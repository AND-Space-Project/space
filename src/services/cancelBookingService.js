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
            (err, rowCount) => {
                if (err) {
                    console.error(err.message);
                }
                console.log("Deleted: " + rowCount);
                FindNumberOfDesksAvailable(ClubDayId, rowCount);
            }
        );

        request.addParameter('clubDayId', TYPES.Int, ClubDayId);
        request.addParameter('email', TYPES.VarChar, email);

        connection.execSql(request);
    }

    function FindNumberOfDesksAvailable(ClubDayId, numberToUpdate) {
        var request = new Request(
            'SELECT TOP 1 @availableDesks=AvailableDesks FROM [dbo].[ClubDayInfo] WHERE ClubDayId = @clubDayId',
            (err) => {
                if (err) {
                    console.error(err.message);
                } else {
                    FindNextInQueue(ClubDayId, numberToUpdate);
                }
            }
        );

        request.addParameter('clubDayId', TYPES.Int, ClubDayId);
        request.addOutputParameter('availableDesks', TYPES.Int);

        request.on('returnValue', (paramName, value) => {
            if (numberToUpdate > value) {
                numberToUpdate = value;
            }
        });
        
        connection.execSql(request);

    }

    function FindNextInQueue(ClubDayId, numberToUpdate) {
        numberToUpdate = numberToUpdate - 1;
        var request = new Request(
            'UPDATE [dbo].[Bookings] SET Waitlist = 0, DateModified = GETDATE() WHERE BookingId = (SELECT TOP 1 BookingId FROM [dbo].[Bookings] WHERE ClubDayId = @clubDayId AND Waitlist = 1 ORDER BY DateCreated ASC)',
            (err, rowCount) => {
                if (err) {
                    console.error(err.message);
                    return;
                }
                if (numberToUpdate > 0 && rowCount > 0) {
                    console.log("Number left to update: " + numberToUpdate);
                    FindNextInQueue(ClubDayId, numberToUpdate);
                } else {
                    console.log("Loops left: " + numberToUpdate)
                    return;
                }
            }
        );

        request.addParameter('clubDayId', TYPES.Int, ClubDayId);

        connection.execSql(request);
    }

    connection.close();
    return;
}
