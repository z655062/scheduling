'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ShiftRequests', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Users', key: 'id' }
      },
      shift_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Shifts', key: 'id' },
        onDelete: 'CASCADE'
      },
      status: {
        type: Sequelize.ENUM('pending', 'approved', 'rejected'),
        defaultValue: 'pending'
      },
      note: {
        type: Sequelize.STRING
      },
      // 修正：底線命名
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    // 索引補齊 (與 Model 對齊)
    await queryInterface.addIndex('ShiftRequests', ['user_id']);
    await queryInterface.addIndex('ShiftRequests', ['shift_id']);
    await queryInterface.addIndex('ShiftRequests', ['status']);
    await queryInterface.addIndex('ShiftRequests', ['user_id', 'shift_id'], {
      unique: true,
      name: 'unique_user_shift_request'
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('ShiftRequests');
  }
};