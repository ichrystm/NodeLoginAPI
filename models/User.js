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
        if(result.length > 0){
          return result;
        }else{
          return undefined;
        }
      }catch(err){
        console.log(err);
        return [];
      }
    }

    async update(id, email, name, role){

      var user = await this.findUser(id);

      if(user != undefined){

        var editUser = {};

        if(email != undefined){
          var result = await this.findEmail(email);
          if(result == false){
            editUser.email = email;
          }else{
            return {status: false, err: "O email já esta cadastrado!"};
          }
        }

        if(name != undefined){
          editUser.name = name;
        }

        if(role != undefined){
          editUser.role = role;
        }

        try{
          await knex.update(editUser).where({id: id}).table("users");
          return {status: true};
        }catch(err){
          return {status: false, err: err};
        }

      }else{
        return {status: false, err: "O usuário não existe!"};
      }

    }

    async delete(id){
      var user = await this.findUser(id)
      console.log(user);
      if(user.length != 0){
        try{
          await knex.delete().where({id: id}).table("users");
          return {status: true}
        }catch(err){
          return {status: false, err: err}
        }
      }else{
        return {status: false, err: "O usuário não existe!"}
      }
    }

}

module.exports = new User();