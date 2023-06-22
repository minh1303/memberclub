const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const User = sequelize.define("user", {
  firstname: { type: DataTypes.TEXT, allowNull: false },
  lastname: { type: DataTypes.TEXT, allowNull: false },
  fullname: {
    type: DataTypes.VIRTUAL,
    get() {
      return `${this.firstname} ${this.lastname}`;
    },
  },
  username: { type: DataTypes.TEXT, allowNull: false },
  password: { type: DataTypes.TEXT, allowNull: false },
  membership_status: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  admin: {type:DataTypes.BOOLEAN, defaultValue:false}
});

module.exports = User