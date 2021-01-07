var validator = require("email-validator");
var User = require("../models/User");
var PasswordToken = require("../models/PasswordToken");
var bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");

var secret = 'dshuahdsauhdau';

class UserController{

  async index(req, res){};

  async findAllUsers(req, res){

    try{
      var results = await User.findAll();
      if(results.length == 0){
        res.status = 200
        res.json({
          Results: "Não existem usuários cadastrados!"
        });
        return;
      }else{
        res.status = 200;
        res.json({results});
      }
    }catch(err){
      console.log(err);
      return;
    }
    
  };

  async findUser(req, res){
    var id = req.params.id;
    try{
      var result = await User.findUserById(id);
      if(result == undefined){
        res.status = 200;
        res.json({
          Error: "Nenhum usuário encontrado com o id informado!"
        });
        return;
      }else{
        res.status = 200;
        res.json(result);
        return;
      }
    }catch(err){
      console.log(err);
      return;
    }
  };

  async editUser(req, res){

    var {id, email, name, role} = req.body;
    var result = await User.update(id, email, name, role);
    if(result != undefined){
      if(result.status == true){
        res.status = 200;
        res.send({message: "Tudo OK!"})
      }else{
        res.status = 406;
        res.send({error: result.err})
      }
    }else{
      res.status = 406;
      res.send({error: "Ocorreu um erro no servidor!"})
    }

  }

  async delete(req, res){
    var id = req.params.id;

    var result = await User.delete(id);

    if(result.status){
      res.status = 200;
      res.send({
        message: "Usuário deletado!"
      });
    }else{
      res.status = 406;
      res.send({
        error: result.err
      })
    }

  }

  async recoverPassword(req, res){

    var email = req.body.email;
    var result = await PasswordToken.create(email);
    if(result.status){
      res.status = 200;
      res.send({
        token: result.token
      })
    }else{
      res.status = 406;
      res.send({
        err: result.err
      })
    }

  }

  async changePassword(req, res){
    var {token, password} = req.body;

    var isTokenValid = await PasswordToken.validade(token);

    if(isTokenValid.status){

      await User.changePassword(password, isTokenValid.user.user_id, isTokenValid.user.token);
      res.status = 200;
      res.send({
        message: "Senha alterada"
      });

    }else{
      res.status = 406;
      res.send({
        err: "Token inválido"
      })
    }

  }

  async create(req, res){
    var {email, name, password} = req.body;
    var isEmail = validator.validate(email);
    var emailError;
    var nameError;
    var passwordError;
    var error = false;

    if(email == undefined || !isEmail){
      emailError = "O e-mail é inválido";
      error = true;
    }

    if(name == undefined || name.length <= 3){
      nameError = "O nome é inválido";
      error = true;
    }

    if(password == undefined || password.length < 7){
      passwordError = "A senha deve possuir pelo menos 7 caracteres!";
      error = true;
    }

    if(error){
      res.status = 403;
      res.send({
        email: emailError,
        nome: nameError,
        senha: passwordError
      })
      return;
    }else{
      try{
        var emailExists = await User.findEmail(email);
      }catch(err){
        console.log(err);
        return;
      }
      
      if(emailExists){
        res.status = 406;
        res.json({
          Error: "O e-mail informado ja está cadastrado!"
        });
        return
      }
      await User.new(email, name, password);
      res.status = 200;
      res.send({
        message: "ok"
      });
    }
  }

  async login(req, res){
    var {email, password} = req.body;

    var user = await User.findUserByEmail(email);
    if(user != undefined){
      var result = await bcrypt.compare(password, user[0].password);
      
      if(result){
        var token = jwt.sign({email: user[0].email, role: user[0].role}, secret)
        //console.log(user[0]);
        res.status = 200;
        res.send({
          token: token
        })
      }else{
        res.status = 406
        res.send({
          err: "Senha incorreta!"
        })
      }

    }else{
      res.send({status: false});
    }

  }

}

module.exports = new UserController();