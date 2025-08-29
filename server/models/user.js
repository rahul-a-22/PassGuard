const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true // Null for OAuth users
    },
    googleId: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true
    },
    provider: {
      type: DataTypes.ENUM('local', 'google'),
      defaultValue: 'local'
    }
  }, {
    timestamps: true,
    hooks: {
      beforeCreate: async (user) => {
        // Only hash password for local authentication
        if (user.password && user.provider === 'local') {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
      beforeUpdate: async (user) => {
        // Only hash password if it's changed
        if (user.changed('password') && user.password) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      }
    }
  });

  // Instance method to compare password
  User.prototype.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
  };

  // Define associations
  User.associate = (models) => {
    User.hasMany(models.Password, {
      foreignKey: 'userId',
      as: 'passwords',
      onDelete: 'CASCADE'
    });
  };

  return User;
};