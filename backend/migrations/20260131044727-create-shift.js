'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Shifts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      shift_range_id: {
        type: Sequelize.INTEGER,
        references: { model: 'ShiftRanges', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      shift_date: {
        type: Sequelize.DATEONLY,
        allowNull: false // 班次日期不應為空
      },
      start_time: {
        type: Sequelize.TIME,
        allowNull: false
      },
      end_time: {
        type: Sequelize.TIME,
        allowNull: false
      },
      max_participants: {
        type: Sequelize.INTEGER,
        defaultValue: 1
      },
      shift_type: {
        type: Sequelize.STRING
      },
      // 修正：改為底線命名以匹配 Model 設定
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    // 索引對照修正
    await queryInterface.addIndex('Shifts', ['shift_date'], {
      name: 'idx_shift_date'
    });
    
    await queryInterface.addIndex('Shifts', ['shift_range_id', 'shift_type'], {
      name: 'idx_shift_range_type'
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Shifts');
  }
};