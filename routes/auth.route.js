const router = require("express").Router();
const bodyparser = require("body-parser");
const check = require("express-validator").check;
const signupController = require("../controllers/auth.controller");
const Auth = require("./auth.guard");
const Type = require("./auth.type");
const bodyParser = require("body-parser");
const multer = require("multer");


router.get("/login", Auth.isNotAuth, signupController.getlogin);

router.post(
  "/login",
  Auth.isNotAuth,
  bodyparser.urlencoded({ extended: false }),
  check("username").not().isEmpty().withMessage("اسم المستخدم مطلوب"),
  check("password")
    .not()
    .isEmpty()
    .withMessage("كلمه السر مطلوبه")
    .isLength({ min: 6 })
    .withMessage("كلمه السر يجب الا تقل عن 6 احرف"),
  signupController.postlogin
);

router.all("/logout", Auth.isAuth, signupController.logout);



module.exports = router;
