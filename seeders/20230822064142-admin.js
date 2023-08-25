'use strict';
// import bcrypt from 'bcrypt';
const bcrypt = require('bcrypt');
/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * 
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    const hashedPassword = await bcrypt.hash('jenish@123', 10);
    await queryInterface.bulkInsert('admins', [{
      name: 'jenish' ,
      email: 'jenish@admin.com',
      password: hashedPassword ,

       }], {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
