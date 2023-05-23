const { validationResult } = require("express-validator");
const user = require("../models/auth.model");
const StudentModel = require("../models/student.model");



exports.getHome = (req, res, next) => {
  res.render("index", {
    name: req.session.name,
    type: req.session.type,
    accademic: req.session.accademic,
    pageTitle: "FCI",
    image: req.session.image,
    validationErr: req.flash("validationErr")[0],
  });
};




exports.getlogin = (req, res, next) => {
  res.render("AuthPages/login", {
    name: req.session.name,
    accademic: req.session.accademic,
    type: req.session.type,
    image: req.session.image,
    pageTitle: "Login | FCI",
    authErr: req.flash("authErr")[0],
    validationErrs: req.flash("validationErrs"),
  });
};

exports.postlogin = (req, res, next) => {
  if (validationResult(req).isEmpty()) {
    user
      .addToLogin(req.body.username, req.body.password)
      .then((user) => {
        req.session.userId = user.id;
        req.session.type = user.type;
        req.session.name = user.username;
        req.session.prevSub = user.prevSub;
        req.session.accademic = user.accademic;
        req.session.image = user.image;
        res.redirect("/");
      })
      .catch((err) => {
        req.flash("authErr", err);
        res.redirect("/login");
      });
  } else {
    req.flash("validationErrs", validationResult(req).array());
    res.redirect("/login");
  }
};


exports.logout = (req, res, next) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
};

