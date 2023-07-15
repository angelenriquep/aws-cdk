import { Stack, StackProps, Duration } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as resources from 'aws-cdk-lib/custom-resources';

import { DynamoDB } from './construct/DynamoDB';
import { LambdaLoader } from './construct/Lambda';

export class InfraStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const db = new DynamoDB(this, 'DynamoDB');

    const lambda = new LambdaLoader(this, 'LambdaLoader', { tableName: db.table.tableName });
    lambda.node.addDependency(db);

    db.table.grantWriteData(lambda.lambda);

    // This type of manual actions should be performed using custom resources
    const lambdaResource = new resources.AwsCustomResource(this, 'initLambdaDBDataBatch', {
      onCreate: {
        service: 'Lambda',
        action: 'invoke',
        parameters: {
          FunctionName: lambda.lambda.functionArn,
          InvocationType: 'Event',
        },
        physicalResourceId: resources.PhysicalResourceId.of('initLambdaDBDataBatch'),
      },
      policy: resources.AwsCustomResourcePolicy.fromSdkCalls({ resources: [lambda.lambda.functionArn, db.table.tableArn] }),
      timeout: Duration.minutes(3),
    });
    lambdaResource.node.addDependency(lambda);

    lambda.lambda.grantInvoke(lambdaResource);
  }
}
