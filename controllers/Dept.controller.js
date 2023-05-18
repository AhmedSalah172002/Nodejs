const DeptModel = require("../models/Dept.model");
const validationResult = require("express-validator").validationResult;

exports.getDept = (req, res, next) => {
  DeptModel.getItems()
    .then((items) => {
      res.render("departments", {
        items: items,
        pageTitle: "Departments | FCI",
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getDepartments = (req, res, next) => {
  DeptModel.getItems()
    .then((items) => {
      res.render("getDepartments", {
        items: items,
        pageTitle: "Departments | FCI",
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postDept = (req, res, next) => {
  if (validationResult(req).isEmpty()) {
    DeptModel.addNewItem({
      deptName: req.body.deptName,
      deptCode: req.body.deptCode,
    })
      .then(() => {
        req.flash("deptAddedSuccessfully", "تم اضافه قسم جديد ");
        res.redirect("/getDepartments");
      })
      .catch((err) => {
        req.flash("deptAddErr", err);
        res.redirect("/departments");
      });
  } else {
    req.flash("validationErrs", validationResult(req).array());
    res.redirect("/departments");
  }
};

exports.postDelete = (req, res, next) => {
  DeptModel.deleteItem(req.body.deptId)
    .then(() => {
      req.flash("deleteDept", "تم حذف القسم بنجاح");
      res.redirect("/getDepartments");
    })
    .catch((err) => {
      console.log(err);
      req.flash("deleteDept", "خطأ فى حذف القسم");
      res.redirect("/getDepartments");
    });
};

exports.getDeptEdit = (req, res, next) => {
  DeptModel.getItems()
    .then((items) => {
      items = items.filter((e) => e._id == req.params.deptId);
      res.render("edit/deptEdit", {
        items: items,
        deptId: req.params.deptId,
        pageTitle: "Departments | FCI",
        validationErrs: req.flash("validationErrs"),
        deptAddErr: req.flash("deptAddErr")[0],
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postDeptEdit = (req, res, next) => {
  if (validationResult(req).isEmpty()) {
    DeptModel.editItem({
      id: req.params.deptId,
      data: {
        deptName: req.body.deptName,
        deptCode: req.body.deptCode,
      },
    })
      .then(() => {
        req.flash("deptAddedSuccessfully", "تم تعديل القسم  بنجاح");
        res.redirect("/getDepartments");
      })
      .catch((err) => {
        req.flash("deptAddErr", err);
        res.redirect(`${req.params.deptId}`);
      });
  } else {
    req.flash("validationErrs", validationResult(req).array());
    res.redirect(`${req.params.deptId}`);
  }
};
