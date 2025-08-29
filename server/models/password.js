const CryptoJS = require('crypto-js');

module.exports = (sequelize, DataTypes) => {
  const Password = sequelize.define('Password', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false
    },
    password: {
      type: DataTypes.TEXT,
      allowNull: false,
      get() {
        // Decrypt the password when retrieving
        const encryptedPassword = this.getDataValue('password');
        if (encryptedPassword) {
          const bytes = CryptoJS.AES.decrypt(
            encryptedPassword,
            process.env.ENCRYPTION_KEY
          );
          return bytes.toString(CryptoJS.enc.Utf8);
        }
        return null;
      },
      set(value) {
        // Encrypt the password before saving
        if (value) {
          const encrypted = CryptoJS.AES.encrypt(
            value,
            process.env.ENCRYPTION_KEY
          ).toString();
          this.setDataValue('password', encrypted);
        }
      }
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    timestamps: true
  });

  // Define associations
  Password.associate = (models) => {
    Password.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
      onDelete: 'CASCADE'
    });
  };

  return Password;
};