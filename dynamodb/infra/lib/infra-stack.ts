import { Stack, StackProps, Duration } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as resources from 'aws-cdk-lib/custom-resources';
import * as iam from 'aws-cdk-lib/aws-iam';

import { DynamoDB } from './construct/DynamoDB';
import { LambdaLoader } from './construct/Lambda';

export class InfraStack extends Stack {
  public readonly db: DynamoDB;
  public readonly lambda: LambdaLoader;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    this.db = new DynamoDB(this, 'DynamoDB');
    this.lambda = new LambdaLoader(this, 'LambdaLoader', { tableName: this.db.table.tableName });
    this.lambda.node.addDependency(this.db);
    this.db.table.grantWriteData(this.lambda.lambda);

    // This type of manual actions shoul dbe performed using custom resources
    const lambdaResource = new resources.AwsCustomResource(this, 'initLambdaDBDataBatch', {
      onCreate: {
        service: 'Lambda',
        action: 'invoke',
        parameters: {
          FunctionName: this.lambda.lambda.functionName,
          InvocationType: 'Event',
        },
        physicalResourceId: resources.PhysicalResourceId.of('initLambdaDBDataBatch'),
      },
      policy: resources.AwsCustomResourcePolicy.fromSdkCalls({ resources: [this.lambda.lambda.functionArn] }),
      timeout: Duration.minutes(3),
    });

    this.lambda.lambda.grantInvoke(lambdaResource);
    lambdaResource.node.addDependency(this.lambda);
  }
}
