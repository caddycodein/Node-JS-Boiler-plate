import { generateToken , generateNewApiToken } from '../ports/GenerateToken';
import { getClientIntegrationByOne } from '../repository/integration/ClientIntegrations';
import logger from './logger';

const getToken = async (request: any, scope: string, feature?: string, api_type?: string) => {
    const token_response: any = {};
    let response: any = {};
    try {
        logger.info('getToken() method started');
        const client_data = await getClientIntegrationByOne(request);

        if (client_data.status && client_data.status === 200) {

            if(feature === 'bank_id'){
                if(client_data.body.enable_bank_id_verification === true)
                    token_response.is_bank_id_verification_enabled = true;
                else{
                    token_response.token = null;
                    token_response.is_bank_id_verification_enabled = false;
                    return token_response;
                }
            }

            if(feature === 'credit_check'){
                if(client_data.body.enable_credit_check === true)
                    token_response.is_credit_check_enabled = true;
                else{
                    token_response.token = null;
                    token_response.is_credit_check_enabled = false;
                    return token_response;
                }
            }

            if(feature === 'esign'){
                if(client_data.body.enable_esign === true)
                    token_response.is_esign_enabled = true;
                else{
                    token_response.token = null;
                    token_response.is_esign_enabled = false;
                    return token_response;
                }
            }


            // generating the token if request validation is successful
            if(api_type && api_type === 'new_api_token'){
                response = await generateNewApiToken(client_data.body.third_party_client_id, client_data.body.third_party_client_secret, scope);
                logger.info(`recieved response from generateToken with status: ${response.status}`);
            }
            else{
                response = await generateToken(client_data.body.client_id, client_data.body.client_secret, scope);
                logger.info(`recieved response from generateToken with status: ${response.status}`);
            }
            
            if(response){
                token_response.token = response.body.data.access_token;
                token_response.domain = client_data.body.third_party_domain;
            }
        }
        logger.info('getToken method ends');
    }
    catch(error){
        logger.error(`Error while creating the token: ${JSON.stringify(error)}`);
    }

    return token_response;
};

export default getToken;