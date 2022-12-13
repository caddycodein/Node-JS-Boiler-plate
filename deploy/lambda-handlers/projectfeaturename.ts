import ApiError from '../../src/abstractions/errors/ApiError';
import ValidationError from '../../src/abstractions/errors/ValidationError';
import { initiateBankIdVerification, updateBankIdVerification } from '../../src/application/bank_id_verification/BankIdVerification';
import AppDataSource from '../../src/lib/dbconnection';
import logger from '../../src/lib/logger';

export const handler = async(event: any, context: any, callback: any) => {
    let response: any = {};

    try{
        if(event && event.source){
            logger.info(`Event triggered to keep the lambda warm`);

            if (AppDataSource && AppDataSource.isInitialized)
                console.log('warming up the database connection as well');
            else
                (await AppDataSource.initialize());

            response = {
                "status": 200,
                "message": 'lambda kept warm'
            }

            return response;
        }

        logger.info(`Bank Id verification lambda fired with request: ${JSON.stringify(event.body)}`);
        context.callbackWaitsForEmptyEventLoop = false;
        const request = JSON.parse(event.body);
        logger.info(`Event parsed`);
        logger.info(`Integration lambda fired with event type: ${request.event_type}`);
        
        if (request.event_type) {
            switch (request.event_type){
                case 'INITIATE_BANK_ID_VERIFICATION':
                    response = await initiateBankIdVerification(request);
                    break;
                case 'UPDATE_BANK_ID_VERIFICATION_STATUS':
                    response = await updateBankIdVerification(request);
                    break;
                default:{
                    response = new ValidationError(['invalid event_type']);
                    throw response;
                }
            }
        }
        else {
            response = new ValidationError(['missing event_type']);
            throw response;
            
        }
    }
    catch(err){
        logger.error(`Error occured in bank id verification lambda: ${err}`);
        if (err instanceof ValidationError) {
            response = new ApiError('VALIDATION_ERROR', 400, [err.message]);
        }
        else{
            response = new ApiError('UNKNOWN_ERROR', 500, ['api error occured']);
        }
    }
    callback(null,{
        "isBase64Encoded": false,
        "statusCode": 200,
        "headers": { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
        "multiValueHeaders": { },
        "body": JSON.stringify(response)
    });
};
