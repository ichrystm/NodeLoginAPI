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

  async validade(token){
    
    try{
      var result = await knex.select().where({token: token}).table("passwordtokens");

      if(result.length > 0){
        var tk = result[0];

        if(tk.used){
          return {status: false};
        }else{
          return {status: true, user: tk};
        }

      }else{
        return {status: false};
      }

    }catch(err){
      console.log(err);
      return false;
    }

  }

  async setUsed(token){
    await knex.update({used: 1}).where({token: token}).table("passwordtokens");
  }

}

module.exports = new PasswordToken();