'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ShiftRequest extends Model {
    static associate(models) {
      // 誰投的申請
      this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
      // 投的是哪一個班
      this.belongsTo(models.Shift, { foreignKey: 'shift_id', as: 'shift' });
      // 如果核准了，會對應到一個正式班表紀錄 (一對一)
      this.hasOne(models.Schedule, { foreignKey: 'request_id', as: 'schedule' });
    }
  }
  
  ShiftRequest.init({
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    shift_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('pending', 'approved', 'rejected'),
      defaultValue: 'pending'
    },
    note: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'ShiftRequest',
    underscored: true,
    indexes: [
      { fields: ['user_id'] },
      { fields: ['shift_id'] },
      { fields: ['status'] },
      {
        unique: true,
        fields: ['user_id', 'shift_id'],
        name: 'unique_user_shift_request'
      }
    ]
  });
  return ShiftRequest;
};