var knex = require("../database/connection");
var User = require("./User");

class PasswordToken{

  async create(email){
    var user = await User.findUserByEmail(email);
    //console.log(user[0].id);
    if(user != undefined){
      var token = Date.now();
      try{
        await knex.insert({
          user_id: user[0].id,
          token: token,
          used: 0,
        }).table("passwordtokens")
        return {status: true, token: token};
      }catch(err){
        return {status: false, err: err}
      }

    }else{
      return {status: false, err: "O usuário não existe"}
    }
  }

}

module.exports = new PasswordToken();