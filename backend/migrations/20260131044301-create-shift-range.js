'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ShiftRanges', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false // 通常名稱不應為空
      },
      start_date: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      end_date: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      is_published: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      // 修正：配合 Model 的 underscored: true，改為底線命名
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    // 補齊：資料庫層級的索引
    await queryInterface.addIndex('ShiftRanges', ['start_date', 'end_date'], {
      name: 'shift_ranges_date_range_idx'
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('ShiftRanges');
  }
};