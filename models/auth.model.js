const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { logout } = require("../controllers/auth.controller");

const db_url = process.env.DB_URL;

const userSchema = mongoose.Schema({
  username: String,
  password: String,
  accademic: {
    type: Number,
    default: 0,
  },
  prevSub: {
    type: String,
    default: "لايوجد",
  },
  image: {
    type: String,
    default: "user-image.jpg",
  },
  type: String,
});

const User = mongoose.model("user", userSchema);

exports.addToSignup = (username, type, password, accademic, prevSub) => {
  const addedSuccessfully = "تم اضافه مستخدم جديد";
  return new Promise((resolve, reject) => {
    mongoose
      .connect(db_url)
      .then(() => {
        return User.findOne({ username, accademic });
      })
      .then((user) => {
        if (user) {
          reject("الحساب موجود بالفعل");
          mongoose.disconnect();
        }
      })
      .then(() => {
        let user = new User({
          username: username,
          password: password,
          accademic: accademic,
          prevSub: prevSub,
          type: type,
        });
        return user.save();
      })
      .then(() => {
        mongoose.disconnect();
        resolve(addedSuccessfully);
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
      .connect(db_url)
      .then(() => {
        return User.find({});
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



exports.deleteItem = (username, _id) => {
  return new Promise((resolve, reject) => {
    mongoose
      .connect(db_url)
      .then(() => User.findOneAndDelete({ username, _id }))
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



exports.editUser = (data) => {
  return new Promise((resolve, reject) => {
    mongoose
      .connect(db_url)
      .then(() => {
        return User.findOne({ username: data.data.username });
      })
      .then((items) => {
        if (!items) {
          return User.findByIdAndUpdate(data.id, data.data);
        }else{
          reject()
        }
      })
      .then(() => {
        mongoose.disconnect();
        resolve("تم التعديل علي المستخدم بنجاح");
      })
      .catch((err) => {
        mongoose.disconnect();
        resolve("حدث خطأ اثناء التعديل");
        console.log(err);
      });
  });
};

