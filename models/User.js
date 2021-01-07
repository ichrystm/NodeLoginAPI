var knex = require("../database/connection");
var bcrypt = require("bcrypt");

class User{
    
    async new(email, name, password){

      try{
          var hash = await bcrypt.hash(password, 10);
          await knex.insert({email, name, password: hash, role: 0}).table("users");
      }catch(err){
        console.log(err);
      }

    }

    async findEmail(email){
        try{
          var result = await knex.select("*").from("users").where({email: email});
          if(result.length > 0){
            return true;
          }else{
            return false;
          }
        }catch(err){
          console.log(err);
          return false;
        }
    }

    async findAll(){
      try{
        var result = await knex.select(["id", "name", "email", "role"]).from("users");
        return result;
      }catch(err){
        console.log(err);
        return [];
      }
    }

    async findUser(id){
      try{
        var result = await knex.select(["id", "name", "email", "role"]).from("users").where({id:id});
        return result;
      }catch(err){
        console.log(err);
        return [];
      }
    }

}

module.exports = new User();