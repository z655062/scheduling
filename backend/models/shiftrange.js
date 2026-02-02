'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ShiftRange extends Model {
    static associate(models) {
      // 這裡之後可以加入：這一個區間擁有多個班次 (Shifts)
      this.hasMany(models.Shift, { foreignKey: 'shift_range_id', as: 'shifts' });
    }
  }

  ShiftRange.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    start_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    end_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    is_published: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
  }, {
    sequelize,
    modelName: 'ShiftRange',
    tableName: 'ShiftRanges', // 強制指定表名，避免自動變複數可能產生的誤判
    underscored: true,        // 這會讓 Sequelize 尋找 created_at 而非 createdAt
    indexes: [
      {
        name: 'shift_ranges_date_range_idx', // 建議與 Migration 索引名稱一致
        fields: ['start_date', 'end_date']
      }
    ]
  });
  return ShiftRange;
};