import { server } from './hosts';
import { setUserState } from './userState';

import axios from 'axios';

// Get the role of user from the session storage
const getCurrUser = () => {
  const result = JSON.parse(sessionStorage.getItem('user'));
  if (!result) {
    return {
      role: 'DefaultUser',
    };
  }
  if (!result.role) {
    return {
      role: 'Student',
    };
  } else if (result.role.type === 'content_creator') {
    return {
      role: 'ContentCreator',
      name: result.role.name,
    };
  } else if (result.role.type === 'authenticated') {
    return {
      role: 'Mentor',
      name: result.role.name,
    };
  }
};

// return user token from strapi
export const postUser = async (body) => {
  const response = await axios.post(`${server}/auth/local`, body);
  return response;
};

// return token from session storage
export const getToken = () => {
  return sessionStorage.getItem('token') || null;
};

// remove the token ans user from the session storage
export const removeUserSession = () => {
  sessionStorage.removeItem('token');
  sessionStorage.removeItem('user');
  setUserState(getCurrUser());
};

// set the token and user from the session storage
export const setUserSession = (jwt, user) => {
  sessionStorage.setItem('token', jwt);
  sessionStorage.setItem('user', user);
  setUserState(getCurrUser());
};
