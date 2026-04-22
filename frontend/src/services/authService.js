import { logEvent } from './auditService';

export const registerUser = async (userData) => {
  const response = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  });
  if (!response.ok) {
    const errorData = await response.json();
    logEvent(null, null, 'REGISTER', 'auth', 'FAILED', { reason: errorData.error });
    throw new Error(errorData.error || 'Registration failed');
  }
  const data = await response.json();
  logEvent(data.id, data.role, 'REGISTER', 'auth', 'SUCCESS');
  return data;
};

export const loginUser = async (email, password) => {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  if (!response.ok) {
    const errorData = await response.json();
    logEvent(null, null, 'LOGIN', 'auth', 'FAILED', { email, reason: errorData.error });
    throw new Error(errorData.error || 'Login failed');
  }
  const data = await response.json();
  localStorage.setItem('healthai_token', data.token);
  localStorage.setItem('healthai_current_user', JSON.stringify(data.user));
  logEvent(data.user.id, data.user.role, 'LOGIN', 'auth', 'SUCCESS');
  return data.user;
};

export const logoutUser = () => {
  const user = getCurrentUser();
  if (user) {
    logEvent(user.id, user.role, 'LOGOUT', 'auth', 'SUCCESS');
  }
  localStorage.removeItem('healthai_token');
  localStorage.removeItem('healthai_current_user');
};

export const getCurrentUser = () => {
  const userStr = localStorage.getItem('healthai_current_user');
  return userStr ? JSON.parse(userStr) : null;
};

export const getToken = () => {
  return localStorage.getItem('healthai_token');
};

export const getAllUsers = async () => {
  return []; // Admin function not fully implemented in demo backend
};

export const toggleUserStatus = async (userId, isActive) => {
  return false;
};

export const updateProfile = async (profileData) => {
  const token = getToken();
  const response = await fetch('/api/users/me', {
    method: 'PUT',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(profileData)
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to update profile');
  }
  const data = await response.json();
  
  // Update local storage user data
  const user = getCurrentUser();
  if (user) {
    const updatedUser = { ...user, ...data };
    localStorage.setItem('healthai_current_user', JSON.stringify(updatedUser));
  }
  return data;
};

export const exportUserData = async () => {
  const token = getToken();
  const response = await fetch('/api/users/me/export', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!response.ok) {
    throw new Error('Failed to export data');
  }
  return await response.json();
};

export const deleteAccount = async () => {
  const token = getToken();
  const response = await fetch('/api/users/me', {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!response.ok) {
    throw new Error('Failed to delete account');
  }
  logoutUser();
};
