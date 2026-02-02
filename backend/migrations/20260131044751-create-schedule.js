'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Schedules', {
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
      request_id: {
        type: Sequelize.INTEGER,
        allowNull: true, // 管理者直接指派時可能沒有對應的 request
        references: { model: 'ShiftRequests', key: 'id' }
      },
      confirmed_by: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Users', key: 'id' } // 記錄是哪位管理者(User)核准的
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

    // 索引補齊
    await queryInterface.addIndex('Schedules', ['user_id']);
    await queryInterface.addIndex('Schedules', ['shift_id']);
    await queryInterface.addIndex('Schedules', ['user_id', 'shift_id'], {
      unique: true,
      name: 'unique_official_schedule'
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Schedules');
  }
};