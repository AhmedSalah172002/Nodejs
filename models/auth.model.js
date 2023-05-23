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



exports.addToLogin = (username, password) => {
  return new Promise((resolve, reject) => {
    mongoose
      .connect(db_url)
      .then(() => {
        return User.findOne({ username: username });
      })
      .then((user) => {
        if (!user) {
          mongoose.disconnect();
          reject("الاسم خطأ");
        } else {
          return User.findOne({ password: password }).then((same) => {
            if (!same) {
              mongoose.disconnect();
              reject("كلمه السر خطأ");
            } else {
              mongoose.disconnect();
              resolve({
                id: user._id,
                type: user.type,
                username: user.username,
                prevSub: user.prevSub,
                accademic: user.accademic,
                image: user.image,
              });
            }
          });
        }
      })
      .catch((err) => {
        mongoose.disconnect();
        reject(err);
      });
  });
};

