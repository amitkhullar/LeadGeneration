
const User = require('../models/user');
const crypto = require('crypto');

var userRepo = function () {

  var ctx = this;

  ctx.signin = function(credentials){

    var userPromise = User.find({"email":credentials.email}).then((user)=>{

        if(Object.keys(user).length > 0)
        {
          console.log(user);
          var salt = user[0].s_validate;
          var password = user[0].p_validate;
          var result = crypto.pbkdf2Sync(credentials.password+"|"+credentials.email, salt, 100000, 512, 'sha512');
          console.log("result"+result);
          if(result == password)
          {
            console.log("valid user");
            return {"userId":user[0]._id,"name":user[0].name};
          }
          else {
            return {error : "Invalid username or password."};
          }
        }

    });
    return userPromise;

  };

  ctx.signup = function(userData){

    console.log("data -email"+userData.email);

    salt = crypto.randomBytes(128).toString('base64'),
    key = crypto.pbkdf2Sync(userData.password+"|"+userData.email, salt, 100000, 512, 'sha512');

    var user = new User({
      name         : userData.fname + " " + userData.lname,
      email        : userData.email,
      p_validate   : key,
      s_validate   : salt,
      roles        : ['c','r','u','d','upl','srch']
    });

    return user.save().then((res)=>{

      return {"userId":res._id,"name":res.name};

    });

  };

  ctx.ifExist = function(details){

    var userPromise = User.find({"email":details.email}).then((user)=>{

        if(Object.keys(user).length > 0)
        {
          return true;

        }
        return false;

      });
    return userPromise;

  };

}

exports.userRepo = new userRepo();
