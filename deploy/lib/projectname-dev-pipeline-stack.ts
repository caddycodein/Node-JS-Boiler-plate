import * as cdk from 'aws-cdk-lib';
import {CodePipeline, CodePipelineSource, ShellStep} from 'aws-cdk-lib/pipelines';
import { ManualApprovalStep } from 'aws-cdk-lib/pipelines';
import { CreditCheckPipeLineStages } from './setup-stages';
import { CDKContext } from '../types';
import gitBranch from 'git-branch';

export class CreditCheckDevPipeLineStack extends cdk.Stack {
        constructor(scope: any, id: string, props?: cdk.StackProps) {
        super(scope, id, props);       

        const buildcommands = [
            'npm ci --save',
            'npm i -g tedious',
            'npm run build',
            'npm run migration-dev:up',
            'cd deploy',
            'npm ci',
            'npm run build',
            'npx cdk synth'
        ]

        const devsynthstep = new ShellStep('Synth', {
            input: CodePipelineSource.connection('caddycodein/creditcheck-server', 
            'develop',
            {
                connectionArn: 
                    "arn:aws:codestar-connections:ap-south-1:760389274302:connection/07f52a9f-6f25-4221-87e7-23e37a82fb69"
            }),
            commands: buildcommands,
            primaryOutputDirectory: 'deploy/cdk.out'
        });

        const devpipeline = new CodePipeline(this, 'Creditcheck-dev-backend-Pipeline', {
            pipelineName: `creditcheck-dev-backend-cicd-pipeline`,
            synth: devsynthstep
        });

        const devcontext: CDKContext = {
            ...scope.node.tryGetContext('environments').find((e: any) => e.branchName === 'develop'),
            ...scope.node.tryGetContext('globals')
          }

        console.log(`printing the dev context: ${JSON.stringify(devcontext)}`);

        const devstage = devpipeline.addStage(new CreditCheckPipeLineStages(this, 'creditcheck-develop', devcontext, {
            env: {
                account: devcontext.accountNumber,
                region: devcontext.region
            }
        }));

    }
}