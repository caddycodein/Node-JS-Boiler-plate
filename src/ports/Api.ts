import * as querystring  from 'querystring';
import axios from 'axios';
import logger from '../lib/logger';

// Implemented here so that we don't have to repeat this code everywhere.
const SIGNICAT_API_BASE_URL = 'https://api.signicat.io';
const SIGNICAT_NEW_API_BASE_URL = 'https://api.signicat.com';

const API = {

  async post(path: any, params: any, config?: any) {
    logger.info(`calling api ${SIGNICAT_API_BASE_URL}${path} with headers: ${config} and body : ${params}`);
    const response = await axios.post(`${SIGNICAT_API_BASE_URL}${path}`, params, config);
    logger.info(`response thirdparty api: ${response}`);
    return response;
  },

  async newApiPost(path: any, params: any, config?: any) {
    logger.info(`calling api ${SIGNICAT_NEW_API_BASE_URL}${path} with headers: ${config} and body : ${params}`);
    const response = await axios.post(`${SIGNICAT_NEW_API_BASE_URL}${path}`, params, config);
    logger.info(`response thirdparty api: ${response}`);
    return response;
  },

  async get(path: any, params: any ) {
    logger.info(`calling api ${SIGNICAT_API_BASE_URL}${path}  and body : ${params}`);
    const response = await axios.get(`${SIGNICAT_API_BASE_URL}${path}`,params);
    logger.info(`response thirdparty api: ${response}`);
    return response;
  },

  async newApiGet(path: any, params: any ) {
    let response: any;
    logger.info(`calling api ${path}  and body : ${JSON.stringify(params)}`);
    await axios.get(path,params)
    .then(async (res) => {
      response = res;
      
    })
    .catch((err) => {
      logger.error(`Error while calling the get status api from signicat: ${JSON.stringify(err)}`);
    });
    return response;
  },
  
  tokenPost(params: any) {
    return axios.post(`${SIGNICAT_API_BASE_URL}/oauth/connect/token`, querystring.stringify({
      scope: params.scope, 
      grant_type: 'client_credentials'
    }), {
      headers: {
        'Authorization': `Basic ${params.base64encodedcreds}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
  },

  newApiTokenPost(params: any) {
    return axios.post(`${SIGNICAT_NEW_API_BASE_URL}/auth/open/connect/token`, querystring.stringify({
      scope: params.scope, 
      grant_type: 'client_credentials'
   }), {
      auth: {
        username: params.username,
        password: params.password
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
  },
  
};

export default API;
