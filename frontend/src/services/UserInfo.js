var UserInfo = (function() {
    var email = "";
    var clubId = -1;
    var fullName = "";
  
    var getEmail = function() {
      return email;
    };
  
    var setEmail = function(Email) {
      email = Email.trim();     
    };

    var getClubId = function() {
      return clubId;
    }

    var setClubId = function(Id) {
      clubId = Id;
    }

    var getFullName = function() {
      return fullName;
    }

    var setFullName = function(name) {
      fullName = name;
    }
  
    return {
      getEmail: getEmail,
      setEmail: setEmail,
      getClubId: getClubId,
      setClubId: setClubId,
      getFullName,
      setFullName
    }
  
  })();
  
  export default UserInfo;
  