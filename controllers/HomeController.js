class HomeController{

    async index(req, res){
        res.send("App online.");
    }

    async validade(req, res){
        res.send("okay");
    }

}

module.exports = new HomeController();