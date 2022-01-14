'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Book extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Book.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Please pride a "title"',
        },
        notEmpty: {
          msg: 'Please pride a "title"',
        },
      },
    }, 
    author: {
        type: DataTypes.STRING,
        allowNull: false,
      validate: {
        notNull: {
          msg: 'Please provide name of "Author"',
        },
        notEmpty: {
          msg: 'Please provide name of "Author"',
        },
      },
    }, 
    genre: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Please provide the "Genre"',
        },
        notEmpty: {
          msg: 'Please provide the "Genre"',
        },
      },
    }, 
    year: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Please provide the "Year"',
        },
        notEmpty: {
          msg: 'Please provide the "Year"',
        },
      },
    },
  }, {
    sequelize,
    modelName: 'Book',
  });
  return Book;
};