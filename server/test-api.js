/**
 * Simple API test script for PassGuard
 * 
 * This script tests the basic functionality of the backend API endpoints
 * Run with: node test-api.js
 */

const axios = require('axios');
require('dotenv').config();

const API_URL = 'http://localhost:5000/api';
let authToken = '';
let userId = '';
let passwordId = '';

// Test user credentials
const testUser = {
  name: 'Test User',
  email: `test${Date.now()}@example.com`,
  password: 'Password123!'
};

// Test password entry
const testPassword = {
  title: 'Test Website',
  username: 'testuser',
  password: 'testpassword123',
  notes: 'This is a test password entry'
};

// Updated password entry
const updatedPassword = {
  title: 'Updated Test Website',
  username: 'updateduser',
  password: 'updatedpassword123',
  notes: 'This is an updated test password entry'
};

// Helper function to log test results
const logTest = (testName, success, data = null, error = null) => {
  console.log(`\n----- ${testName} -----`);
  if (success) {
    console.log('✅ PASSED');
    if (data) console.log('Data:', data);
  } else {
    console.log('❌ FAILED');
    if (error) console.log('Error:', error.response?.data || error.message);
  }
};

// Run all tests sequentially
const runTests = async () => {
  try {
    // 1. Register a new user
    await testRegister();
    
    // 2. Login with the new user
    await testLogin();
    
    // 3. Get user profile
    await testGetProfile();
    
    // 4. Create a new password entry
    await testCreatePassword();
    
    // 5. Get all passwords
    await testGetAllPasswords();
    
    // 6. Get a specific password
    await testGetPassword();
    
    // 7. Update a password
    await testUpdatePassword();
    
    // 8. Delete a password
    await testDeletePassword();
    
    console.log('\n✅✅✅ All tests completed! ✅✅✅');
  } catch (error) {
    console.error('\n❌❌❌ Test suite failed! ❌❌❌', error);
  }
};

// Test user registration
const testRegister = async () => {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, testUser);
    userId = response.data.user.id;
    logTest('Register User', true, { userId });
    return response.data;
  } catch (error) {
    logTest('Register User', false, null, error);
    throw error;
  }
};

// Test user login
const testLogin = async () => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, {
      email: testUser.email,
      password: testUser.password
    });
    authToken = response.data.token;
    logTest('Login User', true, { token: `${authToken.substring(0, 15)}...` });
    return response.data;
  } catch (error) {
    logTest('Login User', false, null, error);
    throw error;
  }
};

// Test getting user profile
const testGetProfile = async () => {
  try {
    const response = await axios.get(`${API_URL}/auth/profile`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    logTest('Get User Profile', true, response.data);
    return response.data;
  } catch (error) {
    logTest('Get User Profile', false, null, error);
    throw error;
  }
};

// Test creating a password entry
const testCreatePassword = async () => {
  try {
    const response = await axios.post(
      `${API_URL}/passwords`,
      testPassword,
      { headers: { Authorization: `Bearer ${authToken}` } }
    );
    passwordId = response.data.id;
    logTest('Create Password', true, { passwordId });
    return response.data;
  } catch (error) {
    logTest('Create Password', false, null, error);
    throw error;
  }
};

// Test getting all passwords
const testGetAllPasswords = async () => {
  try {
    const response = await axios.get(
      `${API_URL}/passwords`,
      { headers: { Authorization: `Bearer ${authToken}` } }
    );
    logTest('Get All Passwords', true, { count: response.data.length });
    return response.data;
  } catch (error) {
    logTest('Get All Passwords', false, null, error);
    throw error;
  }
};

// Test getting a specific password
const testGetPassword = async () => {
  try {
    const response = await axios.get(
      `${API_URL}/passwords/${passwordId}`,
      { headers: { Authorization: `Bearer ${authToken}` } }
    );
    logTest('Get Password by ID', true, { title: response.data.title });
    return response.data;
  } catch (error) {
    logTest('Get Password by ID', false, null, error);
    throw error;
  }
};

// Test updating a password
const testUpdatePassword = async () => {
  try {
    const response = await axios.put(
      `${API_URL}/passwords/${passwordId}`,
      updatedPassword,
      { headers: { Authorization: `Bearer ${authToken}` } }
    );
    logTest('Update Password', true, { title: response.data.title });
    return response.data;
  } catch (error) {
    logTest('Update Password', false, null, error);
    throw error;
  }
};

// Test deleting a password
const testDeletePassword = async () => {
  try {
    const response = await axios.delete(
      `${API_URL}/passwords/${passwordId}`,
      { headers: { Authorization: `Bearer ${authToken}` } }
    );
    logTest('Delete Password', true, response.data);
    return response.data;
  } catch (error) {
    logTest('Delete Password', false, null, error);
    throw error;
  }
};

// Run the tests
runTests();