const mongoose = require("mongoose");
const { subMaterial } = require("../controllers/docSub.controller");
const { Students } = require("./student.model");

const DB_URL = process.env.DB_URL;

const SubSchema = mongoose.Schema({
  subName: String,
  subCode: String,
  subDoc: String,
  deptName: String,
  subPrev: String,
  material: Array,
});

const SubjectItem = mongoose.model("Subject", SubSchema);

exports.addNewItem = (data) => {
  return new Promise((resolve, reject) => {
    mongoose
      .connect(DB_URL)
      .then(() => {
        return SubjectItem.findOne({ subName: data.subName });
      })
      .then((items) => {
        if (!items) {
          let item = new SubjectItem(data);
          return item.save();
        }
      })
      .then(() => {
        mongoose.disconnect();
        resolve();
      })
      .catch((err) => {
        mongoose.disconnect();
        reject(err);
      });
  });
};



exports.getItems = () => {
  return new Promise((resolve, reject) => {
    mongoose
      .connect(DB_URL)
      .then(() => {
        return SubjectItem.find({}).sort({ subDoc: 1 });
      })
      .then((items) => {
        resolve(items);
        mongoose.disconnect();
      })
      .catch((err) => {
        mongoose.disconnect();
        reject(err);
      });
  });
};

exports.deleteItem = (id) => {
  return new Promise((resolve, reject) => {
    mongoose
      .connect(DB_URL)
      .then(() => SubjectItem.findByIdAndDelete(id))
      .then(() => {
        mongoose.disconnect();
        resolve();
      })
      .catch((err) => {
        mongoose.disconnect();
        reject(err);
      });
  });
};

exports.editItem = (data) => {
  return new Promise((resolve, reject) => {
    mongoose
      .connect(DB_URL)
      .then(() => {
        return SubjectItem.findOne({ subName: data.data.subName });
      })
      .then((items) => {
        if (!items) {
          return SubjectItem.findByIdAndUpdate(data.id, data.data);
        }else{
          reject()
        }
      })
      .then(() => {
        mongoose.disconnect();
        resolve();
      })
      .catch((err) => {
        mongoose.disconnect();
        reject(err);
      });
  });
};



exports.getSubjectMaterial = (subName) => {
  return new Promise((resolve, reject) => {
    mongoose
      .connect(DB_URL)
      .then(() => {
        return SubjectItem.findOne({ subName });
      })
      .then((subject) => {
        mongoose.disconnect();
        resolve(subject.material);
      })
      .catch((err) => {
        mongoose.disconnect();
        reject(err);
      });
  });
};
