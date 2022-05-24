const { Connection, Request, TYPES } = require("tedious");
const GetConnection = require('./initiateDbConnection.js');

module.exports = function CheckAvailableDesks(bookingDate, clubId) {
    var avlTotalDesks = [-1, -1];

    connection = GetConnection();
    connection.connect(function(err) {
        if (err) {
          console.log('Connection Failed!');
          throw err;
        }

        var request = new Request(
            'SELECT TOP 1 @avlDesks=AvailableDesks, @totalDesks=TotalDesks FROM [dbo].[ClubDayInfo] where Date = @date AND ClubId = @clubId',
            (err) => {
                if (err) {
                    console.error(err.message);
                    return;
                } 
                if (avlTotalDesks[0] == null) {
                    FindDefaultDesks();
                } else {
                    console.log(avlTotalDesks[0] + "/" + avlTotalDesks[1]);
                }

            }
        );
        request.addParameter('date', TYPES.Date, bookingDate);
        request.addParameter('clubId', TYPES.Int, clubId);
        request.addOutputParameter('avlDesks', TYPES.Int);
        request.addOutputParameter('totalDesks', TYPES.Int);

        request.on('returnValue', (paramName, value) => {
            if (paramName == 'avlDesks') {
                avlTotalDesks[0] = value;
            } else {
                avlTotalDesks[1] = value;
            }
        });
        
        connection.execSql(request);
    });

    function FindDefaultDesks() {
        var request = new Request(
            'SELECT TOP 1 @numDesks=DefaultNumDesks from [dbo].[Clubs] where ClubId = @clubId',
            (err) => {
                if (err) {
                    console.error(err.message);
                } else {
                    console.log(avlTotalDesks[0] + "/" + avlTotalDesks[1]);
                }
            }
        );
        request.addParameter('clubId', TYPES.Int, clubId);
        request.addOutputParameter('numDesks', TYPES.Int);

        request.on('returnValue', (paramName, value) => {
            avlTotalDesks[0] = value;
            avlTotalDesks[1] = value;
        });
        
        connection.execSql(request);
    }

    connection.close();
    return;
}