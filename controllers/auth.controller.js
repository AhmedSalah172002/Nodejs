const { validationResult } = require("express-validator");
const user = require("../models/auth.model");
const StudentModel = require("../models/student.model");

exports.getUsers = (req, res, next) => {
  user
    .getItems()
    .then((Users) => {
      res.render("UsersPages/users", {
        Users: Users,
        pageTitle: "Users | FCI",
        validationError: req.flash("validationErrors")[0],
        addedSuccessfully: req.flash("addedSuccessfully")[0],
        deleteUser: req.flash("deleteUser")[0],
        editStatus: req.flash("editStatus")[0],
      });
    })
    .catch((err) => {
      console.log(err);
      req.flash("fetchUsersErr", "Something went wrong");
    });
};



exports.getSignup = (req, res, next) => {
  res.render("AuthPages/signup", {
    pageTitle: "Signup | FCI",
    validationErrs: req.flash("validationErrs"),
    authErr: req.flash("authErr")[0],
  });
};

exports.postSignup = (req, res, next) => {
  if (validationResult(req).isEmpty()) {
    user
      .addToSignup(
        req.body.username,
        req.body.type,
        req.body.password,
        req.body.accademic,
        req.body.prevSub
      )
      .then((addedSuccessfully) => {
        res.redirect("/users");
        req.flash("addedSuccessfully", addedSuccessfully);
      })
      .catch((err) => {
        res.redirect("/signup");
        req.flash("authErr", err);
      });
  } else {
    req.flash("validationErrs", validationResult(req).array());
    res.redirect("/signup");
  }
};



exports.postDelete = (req, res, next) => {
  user
    .deleteItem(req.body.username, req.body._id)
    .then(() => {
      res.redirect("/users");
      req.flash("deleteUser", "تم ازاله المستخدم");
    })
    .catch((err) => {
      console.log(err);
      req.flash("deleteUser", "حدث خطأ ");
      res.redirect("/users");
    });
};



exports.getEditPageUser = (req, res, next) => {
  user.getItems().then((users) => {
    users = users.filter((e) => e._id == req.params.userId);
    res.render("AuthPages/editUser", {
      users: users,
      id: req.params.userId,
      pageTitle: "User | Edit",
      validationErrs: req.flash("validationErr")[0],
      editUserStatus: req.flash("editStatus")[0],
      deleteImageStatus: req.flash("deleteImageStatus")[0],
    });
  });
};

exports.postEditPage = (req, res, next) => {
  if (validationResult(req).isEmpty()) {
    user
      .editUser({
        id: req.params.userId,
        data: {
          username: req.body.username,
          type: req.body.type,
          password: req.body.password,
          accademic: req.body.accademic,
          prevSub: req.body.prevSub,
          image: req.session.image,
        },
      })
      .then(() => {
        res.redirect("/users");
        req.flash("editStatus", "تم التعديل بنجاح");
      })
      .catch((err) => {
        console.log(err);
        res.redirect(`/users/edit/${req.params.userId}`);
        req.flash("editStatus", "حدث خطأ حاول مره اخرى");
      });
  } else {
    res.redirect(`/users/edit/${req.params.userId}`);
    req.flash("validationErr", validationResult(req).array());
  }
};

