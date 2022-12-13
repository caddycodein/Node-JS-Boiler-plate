import { StackProps } from "aws-cdk-lib";
import { Key } from "aws-cdk-lib/aws-kms";
import { AssetCode } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { HttpMethod } from "aws-cdk-lib/aws-stepfunctions-tasks";

export type CDKContext = {
  appName: string;
  region: string;
  environment: string;
  branchName: string;
  accountNumber: string;
  db_type: string;
  db_name: string;
  db_host: string;
  db_port: string;
  db_username: string;
  db_password: string;
  signicat_api_url:string;
  signicat_new_api_url:string;
  vpc?: {
    id: string;
    cidr: string;
    privateSubnetIds: string[];
  };
  // baseDomain: string;
  // apiDomain: string;
  // hostedZondId: string;
  // regionalCertArn: string;
};

export type LambdaDefinition = {
  name: string;
  memoryMB?: number;
  timeoutMins?: number;
  environment?: {
    [key: string]: string;
  };
  isPrivate?: boolean;
  api?: {
    path: string;
    methods: string;
  }
};

export interface APIStackProps extends StackProps{
  lambdaFunctions: {
    [Key: string]: NodejsFunction
  };
}