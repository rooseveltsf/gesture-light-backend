module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('images', 'url', {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },

  down: (queryInterface) => {
    return queryInterface.removeColumn('images', 'url');
  },
};
