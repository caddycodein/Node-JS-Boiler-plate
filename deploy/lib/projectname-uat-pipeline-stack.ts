import * as cdk from 'aws-cdk-lib';
import {CodePipeline, CodePipelineSource, ShellStep} from 'aws-cdk-lib/pipelines';
import { ManualApprovalStep } from 'aws-cdk-lib/pipelines';
import { CreditCheckPipeLineStages } from './setup-stages';
import { CDKContext } from '../types';
import gitBranch from 'git-branch';

export class CreditCheckUatPipeLineStack extends cdk.Stack {
        constructor(scope: any, id: string, props?: cdk.StackProps) {
        super(scope, id, props);       

        const buildcommands = [
            'npm ci --save',
            'npm i -g tedious',
            'npm run build',
            'npm run migration-uat:up',
            'cd deploy',
            'npm ci',
            'npm run build',
            'npx cdk synth'
        ]

        const uatsynthstep = new ShellStep('Synth', {
            input: CodePipelineSource.connection('caddycodein/creditcheck-server', 
            'uat',
            {
                connectionArn: 
                    "arn:aws:codestar-connections:ap-south-1:760389274302:connection/07f52a9f-6f25-4221-87e7-23e37a82fb69"
            }),
            commands: buildcommands,
            primaryOutputDirectory: 'deploy/cdk.out'
        });

        const uatpipeline = new CodePipeline(this, 'Creditcheck-uat-backend-Pipeline', {
            pipelineName: `creditcheck-uat-backend-cicd-pipeline`,
            synth: uatsynthstep
        });

        const uatcontext: CDKContext = {
            ...scope.node.tryGetContext('environments').find((e: any) => e.branchName === 'uat'),
            ...scope.node.tryGetContext('globals')
          }

        const uatstage = uatpipeline.addStage(new CreditCheckPipeLineStages(this, 'creditcheck-uat', uatcontext, {
            env: {
                account: uatcontext.accountNumber,
                region: uatcontext.region
            }
        }));


    }
}