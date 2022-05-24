const { Connection, Request, TYPES } = require("tedious");
const GetConnection = require('./initiateDbConnection.js');

module.exports = function CreateBooking(clubId, bookingDate, email, isKeyholder, fullName) {
    if (isKeyholder == true && fullName !== null) { // fullName field should be null if not a guest since name can be gathered from Name Parser
        console.log("Cannot be a guest and keyholder");
        return;
    }
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
        var totalDesks = -1;
        var request = new Request(
            'SELECT TOP 1 @Id=ClubDayId, @totalDesks=NumDesks FROM [dbo].[ClubDays] WHERE Date = @bookingDate AND ClubId = @clubId',
            (err, rowCount, rows) => {
                if (err) {
                    console.error(err.message);
                } else {
                    if (rowCount > 0) {
                        console.log("Date Found");
                        CheckDesksAvailable(ClubDayId, totalDesks);
                    } else {
                        console.log("Date not found");
                        FindNumDesks();
                    }
                }
            }
        );

        request.addParameter('bookingDate', TYPES.Date, bookingDate);
        request.addParameter('clubId', TYPES.Int, clubId);
        request.addOutputParameter('Id', TYPES.Int);
        request.addOutputParameter('totalDesks', TYPES.Int);

        request.on('returnValue', (paramName, value) => {
            if (paramName == 'Id') {
                ClubDayId = value;
            } else {
                totalDesks = value;
            }
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
        request.addParameter('clubId', TYPES.Int, clubId);
        request.addOutputParameter('numDesks', TYPES.Int);
        
        request.on('returnValue', (paramName, value) => {
            numDesks = value;
        });
        
        connection.execSql(request);
    }

    function CreateClubDay(numDesks) {
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
        request.addParameter('clubId', TYPES.Int, clubId);
        request.addParameter('date', TYPES.Date, bookingDate);
        request.addParameter('numDesks', TYPES.Int, numDesks);
        
        connection.execSql(request);

    }

    function CheckDesksAvailable(ClubDayId) {
        var avlDesks = -1;
        var request = new Request(
            'SELECT TOP 1 @avlDesks=AvailableDesks from [dbo].[ClubDayInfo] where ClubDayId = @clubDayId',
            (err) => {
                if (err) {
                    console.error(err.message);
                } else {
                    CreateDeskBooking(ClubDayId, (avlDesks <= 0));
                }
            }
        );
        request.addParameter('clubDayId', TYPES.Int, ClubDayId);
        request.addOutputParameter('avlDesks', TYPES.Int);

        request.on('returnValue', (paramName, value) => {
            avlDesks = value;
        });
        
        connection.execSql(request);
    }

    function CreateDeskBooking(ClubDayId, waitlist) {
        var request = new Request(
            'INSERT INTO [dbo].[Bookings] (ClubDayId, Email, Waitlist, DateCreated, IsKeyholder, FullName) VALUES (@clubDayId, @email, @waitlist, GETDATE(), @isKeyholder, @fullName)',
            (err) => {
                if (err) {
                    console.error(err.message);
                } else {
                    console.log("Created Booking");
                    return;
                }
            }
        );
        
        request.addParameter('clubDayId', TYPES.Int, ClubDayId);
        request.addParameter('email', TYPES.VarChar, email);
        request.addParameter('waitlist', TYPES.Bit, waitlist);
        request.addParameter('isKeyholder', TYPES.Bit, isKeyholder);
        request.addParameter('fullName', TYPES.VarChar, fullName);
        
        connection.execSql(request);
    }

    connection.close();
    return;
}
