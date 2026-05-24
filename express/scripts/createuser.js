const userSrv = require("../services/user.js");

const {sequelize} = require("../models/index.js");

userSrv.create({
  username: "test",
  password: "12345678",
  needPasswordChange: 1,
}).then(user => {
  if (user) {
    console.log("User created");
    sequelize.close();
  } else {
    throw new Error("Can't create admin");
  }
})
  .catch(error => {
    console.error(error);
    sequelize.close();
  });
