import { server } from './hosts';
import { setUserState, getCurrUser } from './userState';

import axios from 'axios';

// return user token from strapi
export const postUser = async (body) => {
  const response = await axios.post(`${server}/auth/local`, body);
  return response;
};

export const regUser = async (body) => {
  const response = await axios.post(`${server}/auth/local/register`, body); 
    //username: 'testuser',
    //email: 'tu@mail.com',
    //password: '123456',
  
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

export const getSupers = async () => {
  const response = await axios.get(`${server}/strapiusers/super-admin`);

  return response;
};

export const getConfirmed = async () => {
  var thisUser = JSON.parse(sessionStorage.getItem('user'));
  return thisUser.confirmed;
};

export const getMyRole = async () => {
  var thisUser = JSON.parse(sessionStorage.getItem('user'));
  return thisUser.role;
};