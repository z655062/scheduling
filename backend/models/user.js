"use strict";
const { Model } = require("sequelize");
const bcrypt = require("bcrypt");

// 建議的密鑰迭代次數，數字越大越安全，但耗時越久
const PASSWORD_SALT_ROUNDS = 10;

async function hashPassword(user) {
  if (user.password) {
    if (user.isNewRecord || user.changed("password")) {
      try {
        const salt = await bcrypt.genSalt(PASSWORD_SALT_ROUNDS);
        user.password = await bcrypt.hash(user.password, salt);
      } catch (error) {
        console.error("Password hashing failed:", error);
        throw new Error("Password hashing failed during create/update.");
      }
    }
  }
}

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    async comparePassword(candidatePassword) {
      return bcrypt.compare(candidatePassword, this.password);
    }

    static associate(models) {
      // define association here
    }
  }
  User.init({
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    is_active: DataTypes.BOOLEAN,
    role: {
      type: DataTypes.ENUM("normal", "admin"),
      allowNull: false,
      defaultValue: "normal"
    },
    oauth_type: {
      type: DataTypes.ENUM("google", "line"),
    }
  }, {
    sequelize,
    tableName: "Users",
    modelName: "User",
    hooks: {
      beforeCreate: hashPassword,
      beforeUpdate: hashPassword,
      beforeBulkCreate: (users) => {
        return Promise.all(users.map(hashPassword));
      }
    },
  });
  return User;
};