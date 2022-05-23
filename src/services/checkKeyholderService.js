const { Connection, Request, TYPES } = require("tedious");
const GetConnection = require('./initiateDbConnection.js');
const MURRAY_ID = 1;

module.exports = function CheckKeyHolder(bookingDate) {
    var keyholder = false;
    connection = GetConnection();
    connection.connect(function(err) {
        if (err) {
          console.log('Connection Failed!');
          throw err;
        }

        FindKeyholder();
    });

    function FindKeyholder() {
        var request = new Request(
            'SELECT TOP 1 @keyholderCount=Keyholders FROM [dbo].[ClubDayInfo] WHERE Date = @bookingDate AND ClubId = @clubId',
            (err) => {
                if (err) {
                    console.error(err.message);
                } else {
                    console.log(keyholder);
                }
            }
        );

        request.addParameter('bookingDate', TYPES.Date, bookingDate);
        request.addParameter('clubId', TYPES.Int, MURRAY_ID);
        request.addOutputParameter('keyholderCount', TYPES.Int);

        request.on('returnValue', (paramName, value) => {
            if (value > 0) {
                keyholder = true;
            }
        });
        
        connection.execSql(request);
    }

    connection.close();
}
