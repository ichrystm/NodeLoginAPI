var express = require("express")
var router = express.Router();
var HomeController = require("../controllers/HomeController");
var UserController = require("../controllers/UsersController");
var AdminAuth = require("../middlewares/AdminAuth");

router.get('/', HomeController.index);
router.get('/user', AdminAuth, UserController.findAllUsers);
router.get('/user/:id', AdminAuth, UserController.findUser);
router.post('/recoverpassword', UserController.recoverPassword);
router.post('/user', UserController.create);
router.post('/changepassword', UserController.changePassword);
router.post('/login', UserController.login);
router.post('/validade', AdminAuth, HomeController.validade)
router.put('/user', AdminAuth, UserController.editUser);
router.delete('/user/:id', AdminAuth, UserController.delete);


module.exports = router;