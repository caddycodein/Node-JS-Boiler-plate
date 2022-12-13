import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { CreditCheckLambdaStack } from './creditcheck-lambda-stack';
import { ApiGateway, CodebuildStack } from './creditcheck-api-stack';
import { CDKContext } from '../types';

export class CreditCheckPipeLineStages extends cdk.Stage{
    constructor(scope: Construct, stageName: string, context: CDKContext, test: any, props?: cdk.StageProps,) {
        super(scope, stageName ,props);

        const lambdaStack = new CreditCheckLambdaStack(this, stageName, context);
    
        const apigateway = new ApiGateway(this, `creditcheck-apigateway-${context.environment}`, context, { 
          ...props, 
          lambdaFunctions: lambdaStack.lambdaFunctions });  
        
        // console.log(`creating the code build stack`);
        // const codebuild_stack = new CodebuildStack(scope, `creditcheck-${context.environment}-codebuild-migrations`, context, test);

    }
}