'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init({
    username: DataTypes.STRING,
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
    modelName: 'User',
  });
  return User;
};