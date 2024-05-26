'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes, commonFields) => {
  class UsersSpokenLanguages extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  UsersSpokenLanguages.init({
    fk_user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    fk_language_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    ...commonFields, // Include the common fields
  }, {
    sequelize,
    modelName: 'UsersSpokenLanguages',
    tableName: 'users_spoken_languages'
  });
  return UsersSpokenLanguages;
};