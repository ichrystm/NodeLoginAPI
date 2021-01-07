class HomeController{

    async index(req, res){
        res.send("App online.");
    }

}

module.exports = new HomeController();