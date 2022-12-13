import { ContextProvider, Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { APIStackProps, CDKContext } from "types";
import { getLambdaDefinitions } from './creditcheck-lambda-config';
import { LambdaIntegration, RestApi } from "aws-cdk-lib/aws-apigateway";
import * as codebuild from 'aws-cdk-lib/aws-codebuild';
import * as pipeline_actions from 'aws-cdk-lib/aws-codepipeline-actions';


export class ApiGateway extends Stack {
  constructor(scope: Construct, id: string, context: CDKContext, props: APIStackProps) {
    super(scope, id, props);

    // Create a rest api
    const restapi = new RestApi(this, id, {
      description: 'credit check api gateway',
      deployOptions: {
        stageName: 'dev',
      },
      defaultCorsPreflightOptions: {
        allowHeaders: [
          'Content-Type',
        ],
        allowMethods: ['POST'],
        allowCredentials: true,
        allowOrigins: ['*'],
      }
    });

    // Get Lambda definitions
    const lambdaDefinitions = getLambdaDefinitions(context, context.environment);

    // Loop through lambda definitions and create api routes if any
    for (const lambdaDefinition of lambdaDefinitions) {
      if (lambdaDefinition.api) {
        const resource = restapi.root.resourceForPath(lambdaDefinition.api.path);
        restapi._enableCrossEnvironment();
        resource.addMethod(lambdaDefinition.api.methods, new LambdaIntegration(props.lambdaFunctions[lambdaDefinition.name]));
      }
    }
  }
}


export class CodebuildStack extends Stack {
  constructor(scope: Construct,id: string, context : CDKContext, migration_input: any) {
    super(scope, id);

    const migration_project = new codebuild.PipelineProject(scope, `${context.environment}-db-migrations`, {
        buildSpec: codebuild.BuildSpec.fromObject({
          version: '0.2',
          phases: {
            build: {
              commands: [
                'npm run build',
                'npm run migrations:up'
              ],
            },
          },
        }),
      });      

    new pipeline_actions.CodeBuildAction({
          actionName: 'run_crdeitcheck_migrations',
          project: migration_project,
          input: migration_input
        })

  }
}


