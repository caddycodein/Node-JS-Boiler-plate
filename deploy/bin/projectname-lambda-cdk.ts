#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import gitBranch from 'git-branch';
import { CDKContext } from '../types';
import { CreditCheckDevPipeLineStack } from '../lib/creditcheck-dev-pipeline-stack';
import { CreditCheckTestPipeLineStack } from '../lib/creditcheck-test-pipeline-stack';
import { CreditCheckUatPipeLineStack } from '../lib/creditcheck-uat-pipeline-stack';
import { CreditCheckEUProdPipeLineStack } from '../lib/creditcheck-eu-prod-pipeline-stack';

// Get CDK Context based on git branch
export const getContext = async (app: cdk.App) => {
    try {
      const currentBranch = await gitBranch();
      console.log(`logging the branch name:${currentBranch}`);

      const environment = app.node.tryGetContext('environments').find((e: any) => e.branchName === currentBranch);

      const globals = app.node.tryGetContext('globals');

      return { ...globals, ...environment };
    } catch (error) {
      console.error(error);
    }
};

const app = new cdk.App();

new CreditCheckDevPipeLineStack(app, 'creditcheck-dev-backend-pipeline', {
  env: {
      account: '760389274302',
      region: 'ap-south-1'
  }
});

new CreditCheckTestPipeLineStack(app, 'creditcheck-test-backend-pipeline', {
  env: {
      account: '760389274302',
      region: 'us-west-2'
  }
});

new CreditCheckUatPipeLineStack(app, 'creditcheck-uat-backend-pipeline', {
  env: {
      account: '760389274302',
      region: 'us-west-2'
  }
});

new CreditCheckEUProdPipeLineStack(app, 'creditcheck-eu-prod-backend-pipeline', {
  env: {
      account: '760389274302',
      region: 'eu-north-1'
  }
});

app.synth();