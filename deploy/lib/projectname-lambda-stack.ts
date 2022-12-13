import { Stack, StackProps, RemovalPolicy, StageProps, Duration } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { CDKContext } from '../types';

import * as iam from 'aws-cdk-lib/aws-iam';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import * as cwLogs from 'aws-cdk-lib/aws-logs';
import * as targets from 'aws-cdk-lib/aws-events-targets'
import * as events from 'aws-cdk-lib/aws-events'

import { getLambdaDefinitions, getFunctionProps } from './creditcheck-lambda-config';

export class CreditCheckLambdaStack extends Stack {
  public readonly lambdaFunctions: {
    [Key: string]: NodejsFunction
  } = {};


  constructor(scope: Construct, stage: string, context: CDKContext) {
    super(scope, stage);

    console.log(`---------------------------------------------------- in ${context.region} region ---------------------------------------`);
    // Lambda Role
    const lambdaRole = new iam.Role(this, 'lambdaRole', {
      roleName: `${context.appName}-lambda-role-${stage}`,
      description: `Lambda role for ${context.appName}`,
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com')
    });

    // Attach inline policies to Lambda role
    lambdaRole.attachInlinePolicy(
      new iam.Policy(this, 'lambdaExecutionAccess', {
        policyName: 'lambdaExecutionAccess',
        statements: [
          new iam.PolicyStatement({
            effect: iam.Effect.ALLOW,
            resources: ['*'],
            actions: [
              'logs:CreateLogGroup',
              'logs:CreateLogStream',
              'logs:DescribeLogGroups',
              'logs:DescribeLogStreams',
              'logs:PutLogEvents',
              "ec2:CreateNetworkInterface",
              "ec2:DescribeNetworkInterfaces",
              "ec2:DeleteNetworkInterface",
              "ec2:AssignPrivateIpAddresses",
              "ec2:UnassignPrivateIpAddresses"
            ],
          }),
        ],
      })
    );

    // VPC



    // Get Lambda definitions
    const lambdaDefinitions = getLambdaDefinitions(context, stage);

    // Loop through the definitions and create lambda functions
    for (const lambdaDefinition of lambdaDefinitions) {
      // Get function props based on lambda definition
      let functionProps = getFunctionProps(lambdaDefinition, lambdaRole, context, stage);

      // Check if function is private and add VPC, SG and Subnets
      if (lambdaDefinition.isPrivate) {
        functionProps = {
          ...functionProps
        };
      }

      // Lambda Function
      const lambdaFunction = new NodejsFunction(this, `creditcheck-${lambdaDefinition.name}-function`, functionProps);
      this.lambdaFunctions[lambdaDefinition.name] = lambdaFunction;
      console.log(`created lambda function in ${context.region} region`);


      // create scheduler to keep the lambdas warm
      const eventRule = new events.Rule(this, `${lambdaDefinition.name}-keep-warm`, {
        schedule: events.Schedule.rate(Duration.minutes(4)),
      });
      eventRule.addTarget(new targets.LambdaFunction(lambdaFunction))

      // Create corresponding Log Group with one month retention
      new cwLogs.LogGroup(this, `fn-${lambdaDefinition.name}-log-group`, {
        logGroupName: `/aws/lambda/${context.appName}-${lambdaDefinition.name}-${stage}`,
        retention: cwLogs.RetentionDays.ONE_MONTH,
        removalPolicy: RemovalPolicy.DESTROY,
      });
    }
  }
}
