import ApiError from '../abstractions/errors/ApiError';
import CommonResponse from '../abstractions/responses/CommonResponse';
import logger from '../lib/logger';
import api from './Api';

export const generateToken = async(client_id: any, client_secret: any, scope: any) => {
  let res: any = {};  
  try{
        return new Promise((resolve, reject) => {
            const auth_key = Buffer.from(`${client_id}:${client_secret}`).toString('base64');

            logger.info(`calling token post with auth key: ${auth_key} and scope: ${scope}`);
            api.tokenPost({
                base64encodedcreds: auth_key,
                scope
              })
              .then(response => {
                logger.info(`successfully retrieved generate token response: ${response}`);
                res = new CommonResponse(200, 'SUCCESS', 'Token retrieved successfully', response);
                logger.info(`Token returned: ${response.data.access_token}`);
                resolve(res);
              })
              .catch(error => {
                logger.error(`Error while generating token: ${error}`);
                res = new ApiError('UNKNOWN_ERROR', 500, [`${error.message}`]);
                reject(res);
              });
          });
    }
    catch(err){
        logger.error(`Error while generating token: ${err}`);
    }
    logger.info('generateToken() ends');
    return res;
};

export const generateNewApiToken = async(client_id: any, client_secret: any, scope: any) => {
  let res: any = {};  
  try{
        return new Promise((resolve, reject) => {
            const auth_key = `${client_id}:${client_secret}`;

            logger.info(`calling token post with auth key: ${auth_key} and scope: ${scope}`);
            api.newApiTokenPost({
                username: client_id,
                password: client_secret,
                scope
              })
              .then(response => {
                logger.info(`successfully retrieved generate token response: ${response}`);
                res = new CommonResponse(200, 'SUCCESS', 'Token retrieved successfully', response);
                logger.info(`Token returned: ${response.data.access_token}`);
                resolve(res);
              })
              .catch(error => {
                logger.error(`Error while generating token: ${error}`);
                res = new ApiError('UNKNOWN_ERROR', 500, [`${error.message}`]);
                reject(res);
              });
          });
    }
    catch(err){
        logger.error(`Error while generating token: ${err}`);
    }
    logger.info('generateToken() ends');
    return res;
};