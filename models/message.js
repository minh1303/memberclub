const { DataTypes } = require("sequelize");
const sequelize = require("../db");
const User = require("./user");

const Message = sequelize.define("message", {
  title: { type: DataTypes.TEXT, allowNull: false },
  timestamp: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  content: { type: DataTypes.TEXT, allowNull: false },
});

User.hasMany(Message);
Message.belongsTo(User);

module.exports = Message;
