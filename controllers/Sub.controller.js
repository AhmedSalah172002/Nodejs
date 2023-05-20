const SubModel = require("../models/Sub.model");
const StudentModel = require("../models/student.model");
const DeptModel = require("../models/Dept.model");
const validationResult = require("express-validator").validationResult;

exports.getSub = (req, res, next) => {
  SubModel.getItems()
    .then((subjects) => {
      res.render("materials", {
        subjects: subjects,
        pageTitle: "Subjects | FCI",
      });
    })
    .catch((err) => {
      console.log(err);
    });
};


exports.getSubToAdmin = (req, res, next) => {
  SubModel.getItems()
    .then((subjects) => {
      res.render("getMaterials", {
        subjects: subjects,
        pageTitle: "Subjects | FCI",
        validationError: req.flash("validationErrors")[0],
        subAddedSuccessfully: req.flash("subAddedSuccessfully")[0],
        deleteSub: req.flash("deleteSub")[0],
      });
    })
    .catch((err) => {
      console.log(err);
    });
};


exports.postSub = (req, res, next) => {
  if (validationResult(req).isEmpty()) {
    SubModel.addNewItem({
      subName: req.body.subName,
      subCode: req.body.subCode,
      subDoc: req.body.subDoc,
      deptName: req.body.deptName,
      subPrev: req.body.subPrev,
    })
      .then(() => {
        req.flash("subAddedSuccessfully", "تم اضافه الماده بنجاح");
        res.redirect("/getMaterials");
      })
      .catch((err) => {
        req.flash("postSubErr", err);
        res.redirect("/materials");
      });
  } else {
    req.flash("validationErrs", validationResult(req).array());
    res.redirect("/materials");
  }
};

exports.postDelete = (req, res, next) => {
  SubModel.deleteItem(req.body.subId)
    .then(() => {
      req.flash("deleteSub", "تم حذف الماده بنجاح");
      res.redirect("/getMaterials");
    })
    .catch((err) => {
      console.log(err);
      req.flash("deleteSub", "خطأ فى حذف الماده");
      res.redirect("/getMaterials");
    });
};

exports.getsubEdit = (req, res, next) => {
  DeptModel.getItems()
    .then((items) => {
      let sub;
      SubModel.getItems().then((subject) => {
        sub = subject.filter((e) => e._id == req.params.subId);
        res.render("edit/materialEdit", {
          items: items,
          subId: req.params.subId,
          sub: sub,
          pageTitle: "Subjects | FCI",
          validationErrs: req.flash("validationErrs"),
          subAddErr: req.flash("subAddErr")[0],
        });
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postsubEdit = (req, res, next) => {
  if (validationResult(req).isEmpty()) {
    SubModel.editItem({
      id: req.params.subId,
      data: {
        subName: req.body.subName,
        subCode: req.body.subCode,
        subDoc: req.body.subDoc,
        subName: req.body.subName,
        subPrev: req.body.subPrev,
      },
    })
      .then(() => {
        req.flash("subAddedSuccessfully", "تم تعديل المادة  بنجاح");
        res.redirect("/getMaterials");
      })
      .catch((err) => {
        req.flash("postSubErr", err);
        res.redirect(`${req.params.subId}`);
      });
  } else {
    req.flash("validationErrs", validationResult(req).array());
    res.redirect(`${req.params.subId}`);
  }
};
