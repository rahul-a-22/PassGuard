/**
 * Database Initialization Script
 * 
 * This script initializes the database tables for the PassGuard application
 * Run with: node init-db.js
 */

require('dotenv').config();
const { Sequelize } = require('sequelize');
const fs = require('fs');
const path = require('path');

// Import database configuration
const config = require('./config/database');

// Create Sequelize instance
const sequelize = new Sequelize(
  config.development.database,
  config.development.username,
  config.development.password,
  {
    host: config.development.host,
    dialect: config.development.dialect,
    logging: console.log
  }
);

// Import models
const models = {};
const modelsDir = path.join(__dirname, 'models');

// Read all model files and import them
fs.readdirSync(modelsDir)
  .filter(file => {
    return file.indexOf('.') !== 0 && file !== 'index.js' && file.slice(-3) === '.js';
  })
  .forEach(file => {
    const model = require(path.join(modelsDir, file))(sequelize, Sequelize.DataTypes);
    models[model.name] = model;
  });

// Set up associations
Object.keys(models).forEach(modelName => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

// Initialize database
const initDb = async () => {
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log('✅ Database connection has been established successfully.');
    
    // Sync all models with database
    await sequelize.sync({ force: true });
    console.log('✅ All models were synchronized successfully.');
    
    // Create a test admin user
    const testAdmin = await models.User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'Admin123!',
      provider: 'local'
    });
    console.log('✅ Test admin user created:', testAdmin.email);
    
    // Create some sample passwords for the admin user
    const samplePasswords = [
      {
        userId: testAdmin.id,
        title: 'Gmail',
        username: 'admin@gmail.com',
        password: 'GmailPassword123!',
        notes: 'My personal Gmail account'
      },
      {
        userId: testAdmin.id,
        title: 'Facebook',
        username: 'admin@facebook.com',
        password: 'FacebookPassword123!',
        notes: 'Social media account'
      },
      {
        userId: testAdmin.id,
        title: 'Amazon',
        username: 'admin@amazon.com',
        password: 'AmazonPassword123!',
        notes: 'Online shopping account'
      }
    ];
    
    for (const passwordData of samplePasswords) {
      await models.Password.create(passwordData);
    }
    console.log('✅ Sample passwords created for admin user');
    
    console.log('\n✅✅✅ Database initialization completed successfully! ✅✅✅');
    console.log('\nTest credentials:');
    console.log('Email: admin@example.com');
    console.log('Password: Admin123!');
    
  } catch (error) {
    console.error('❌ Unable to initialize database:', error);
  } finally {
    await sequelize.close();
  }
};

// Run the initialization
initDb();