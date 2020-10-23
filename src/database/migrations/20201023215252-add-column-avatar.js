module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('avatars', 'url', {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },

  down: (queryInterface) => {
    return queryInterface.removeColumn('avatars', 'url');
  },
};
