import * as cdk from 'aws-cdk-lib';
import {CodePipeline, CodePipelineSource, ShellStep} from 'aws-cdk-lib/pipelines';
import { ManualApprovalStep } from 'aws-cdk-lib/pipelines';
import { CreditCheckPipeLineStages } from './setup-stages';
import { CDKContext } from '../types';
import gitBranch from 'git-branch';

export class CreditCheckTestPipeLineStack extends cdk.Stack {
        constructor(scope: any, id: string, props?: cdk.StackProps) {
        super(scope, id, props);       

        const buildcommands = [
            'npm ci --save',
            'npm i -g tedious',
            'npm run build',
            'npm run migration-qa:up',
            'cd deploy',
            'npm ci',
            'npm run build',
            'npx cdk synth'
        ]

        const testsynthstep = new ShellStep('Synth', {
            input: CodePipelineSource.connection('caddycodein/creditcheck-server', 
            'test',
            {
                connectionArn: 
                    "arn:aws:codestar-connections:ap-south-1:760389274302:connection/07f52a9f-6f25-4221-87e7-23e37a82fb69"
            }),
            commands: buildcommands,
            primaryOutputDirectory: 'deploy/cdk.out'
        });

        const testpipeline = new CodePipeline(this, 'Creditcheck-test-backend-Pipeline', {
            pipelineName: `creditcheck-test-backend-cicd-pipeline`,
            synth: testsynthstep
        });

        const testcontext: CDKContext = {
            ...scope.node.tryGetContext('environments').find((e: any) => e.branchName === 'test'),
            ...scope.node.tryGetContext('globals')
        }

        const teststage = testpipeline.addStage(new CreditCheckPipeLineStages(this, 'creditcheck-test', testcontext, {
            env: {
                account: testcontext.accountNumber,
                region: testcontext.region
            }
        }));

    }
}