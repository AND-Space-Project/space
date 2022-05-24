const { Connection, Request, TYPES } = require("tedious");
const GetConnection = require('./initiateDbConnection.js');

module.exports = function CheckDayNotice(bookingDate, clubId) {
    var notice = "";
    connection = GetConnection();
    connection.connect(function(err) {
        if (err) {
          console.log('Connection Failed!');
          throw err;
        }

        var request = new Request(
            'SELECT TOP 1 @notice=Notice FROM [dbo].[ClubDayInfo] where Date = @date AND ClubId = @clubId',
            (err) => {
                if (err) {
                    console.error(err.message);
                } else {
                    console.log("Notice: " + notice)
                }
            }
        );
        request.addParameter('date', TYPES.Date, bookingDate);
        request.addParameter('clubId', TYPES.Int, clubId);
        request.addOutputParameter('notice', TYPES.VarChar);

        request.on('returnValue', (paramName, value) => {
            notice = value;
        });
        
        connection.execSql(request);
    });

}