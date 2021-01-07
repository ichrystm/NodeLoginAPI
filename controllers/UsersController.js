var validator = require("email-validator");

class UserController{

  async index(req, res){};

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
    }else{
      res.status = 200;
      res.send({
        message: "ok"
      });
    }
  }

}

module.exports = new UserController();