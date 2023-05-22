const router = require("express").Router();
const bodyparser = require("body-parser");
const check = require("express-validator").check;
const signupController = require("../controllers/auth.controller");
const Auth = require("./auth.guard");
const Type = require("./auth.type");
const bodyParser = require("body-parser");
const multer = require("multer");

router.get("/signup", Type.isAdmin, signupController.getSignup);

router.post(
  "/signup",
  Type.isAdmin,
  bodyparser.urlencoded({ extended: false }),
  check("username").not().isEmpty().withMessage("اسم المستخدم مطلوب"),
  check("type").not().isEmpty().withMessage("من فضلك ادخل نوع الحساب"),
  check("password")
    .not()
    .isEmpty()
    .withMessage("كلمه السر مطلوبه")
    .isLength({ min: 6 })
    .withMessage("كلمه السر يجب الا تقل عن 6 احرف"),
  signupController.postSignup
);



module.exports = router;
