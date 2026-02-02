'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Schedule extends Model {
    static associate(models) {
      // 班次對應的員工
      this.belongsTo(models.User, { foreignKey: 'user_id', as: 'employee' });
      // 所屬的時段
      this.belongsTo(models.Shift, { foreignKey: 'shift_id', as: 'shift' });
      // 來源申請紀錄
      this.belongsTo(models.ShiftRequest, { foreignKey: 'request_id', as: 'source_request' });
      // 核准的管理者
      this.belongsTo(models.User, { foreignKey: 'confirmed_by', as: 'approver' });
    }
  }

  Schedule.init({
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    shift_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    request_id: DataTypes.INTEGER,
    confirmed_by: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Schedule',
    underscored: true,
    indexes: [
      { fields: ['user_id'] },
      { fields: ['shift_id'] },
      {
        unique: true,
        fields: ['user_id', 'shift_id'],
        name: 'unique_official_schedule'
      }
    ]
  });
  return Schedule;
};