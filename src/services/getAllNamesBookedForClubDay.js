const { Connection, Request, TYPES } = require("tedious");
const ParseName = require('./nameParser.js');
const GetConnection = require('./initiateDbConnection.js');

module.exports = function GetAllNames(bookingDate, clubId) {
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
                        GetNames(ClubDayId);
                    } else {
                        console.log("Date not found"); // No bookings for that date
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

    function GetNames(ClubDayId) {
        let names = new Array();
        var request = new Request(
            'SELECT * FROM [dbo].[Bookings] WHERE ClubDayId = @clubDayId AND Waitlist = 0 ORDER BY IsKeyholder DESC',
            (err, rowCount, rows) => {
                if (err) {
                    console.error(err.message);
                } else {
                    if (rowCount > 0) {
                        names.forEach(name => {
                            console.log("\n" + name);
                        });
                    } else {
                        console.log("No bookings"); // No bookings for that date
                    }
                }
            }
        );

        request.addParameter('clubDayId', TYPES.Int, ClubDayId);

        request.on("row", columns => {
            email = "";
            columns.forEach(column => {
                if (column.metadata.colName == "Email") {
                    email = column.value;
                }
                if (column.metadata.colName == "FullName") {
                    if (column.value == null) {
                        names.push(ParseName(email));
                    } else {
                        names.push(column.value);
                    }
                }
            });
          });
        
        connection.execSql(request);
    }

    connection.close();
}
