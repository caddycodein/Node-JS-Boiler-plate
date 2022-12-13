import * as cdk from 'aws-cdk-lib';
import {CodePipeline, CodePipelineSource, ShellStep} from 'aws-cdk-lib/pipelines';
import { ManualApprovalStep } from 'aws-cdk-lib/pipelines';
import { CreditCheckPipeLineStages } from './setup-stages';
import { CDKContext } from '../types';
import gitBranch from 'git-branch';

export class CreditCheckEUProdPipeLineStack extends cdk.Stack {
        constructor(scope: any, id: string, props?: cdk.StackProps) {
        super(scope, id, props);       

        const buildcommands = [
            'npm ci --save',
            'npm i -g tedious',
            'npm run build',
            'npm run migration-eu-prod:up',
            'cd deploy',
            'npm ci',
            'npm run build',
            'npx cdk synth'
        ]

        const euprodsynthstep = new ShellStep('Synth', {
            input: CodePipelineSource.connection('caddycodein/creditcheck-server', 
            'main',
            {
                connectionArn: 
                    "arn:aws:codestar-connections:ap-south-1:760389274302:connection/07f52a9f-6f25-4221-87e7-23e37a82fb69"
            }),
            commands: buildcommands,
            primaryOutputDirectory: 'deploy/cdk.out'
        });

        const euprodpipeline = new CodePipeline(this, 'Creditcheck-eu-prod-backend-Pipeline', {
            pipelineName: `creditcheck-eu-prod-backend-cicd-pipeline`,
            synth: euprodsynthstep
        });

        const euprodcontext: CDKContext = {
            ...scope.node.tryGetContext('environments').find((e: any) => e.branchName === 'main'),
            ...scope.node.tryGetContext('globals')
          }

        const euprodstage = euprodpipeline.addStage(new CreditCheckPipeLineStages(this, 'creditcheck-eu-prod', euprodcontext, {
            env: {
                account: euprodcontext.accountNumber,
                region: euprodcontext.region
            }
        }));


    }
}