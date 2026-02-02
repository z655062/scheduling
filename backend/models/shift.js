'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Shift extends Model {
    static associate(models) {
      // 關聯設定：班次屬於某個區間
      this.belongsTo(models.ShiftRange, { foreignKey: 'shift_range_id', as: 'range' });
      // 關聯設定：一個班次可以有多個意願申請
      this.hasMany(models.ShiftRequest, { foreignKey: 'shift_id', as: 'requests' });
      // 關聯設定：一個班次可以有多個正式班表紀錄
      this.hasMany(models.Schedule, { foreignKey: 'shift_id', as: 'schedules' });
    }
  }

  Shift.init({
    // 注意：這裡不用底線，Sequelize 會因為 underscored: true 自動轉
    shift_range_id: DataTypes.INTEGER,
    shift_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    start_time: {
      type: DataTypes.TIME,
      allowNull: false
    },
    end_time: {
      type: DataTypes.TIME,
      allowNull: false
    },
    max_participants: {
      type: DataTypes.INTEGER,
      defaultValue: 1
    },
    shift_type: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Shift',
    underscored: true,
    indexes: [
      {
        name: 'idx_shift_date',
        fields: ['shift_date']
      },
      {
        name: 'idx_shift_range_type',
        fields: ['shift_range_id', 'shift_type']
      }
    ]
  });
  return Shift;
};