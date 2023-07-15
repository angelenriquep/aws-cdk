import { expect as expectCDK, haveResource } from '@aws-cdk/assert';
import * as cdk from 'aws-cdk-lib';
import { InfraStack } from '../lib/infra-stack';

describe('InfraStack', () => {
  test('should create DynamoDB table', () => {
    const app = new cdk.App();
    const stack = new InfraStack(app, 'TestStack');

    expectCDK(stack).to(haveResource('AWS::DynamoDB::Table'));
  });

  test('should create Lambda function', () => {
    const app = new cdk.App();
    const stack = new InfraStack(app, 'TestStack');

    expectCDK(stack).to(haveResource('AWS::Lambda::Function'));
  });

  test('should grant write access from Lambda to DynamoDB', () => {
    const app = new cdk.App();
    const stack = new InfraStack(app, 'TestStack');

    // TODO: Complete this test to make sure we grant permissions
    expectCDK(stack).to(haveResource('AWS::IAM::Policy'));
  });
});
