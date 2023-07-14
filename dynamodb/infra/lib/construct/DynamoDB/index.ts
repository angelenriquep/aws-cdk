import { RemovalPolicy, Duration } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';

export class DynamoDB extends Construct {
  public readonly table: dynamodb.Table;
  private readonly tableName = 'main_table'

  constructor(scope: Construct, id: string) {
    super(scope, id);

    this.table = new dynamodb.Table(scope, 'MainTable', {
      partitionKey: { name: 'userID', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'ranking', type: dynamodb.AttributeType.NUMBER },
      tableName: this.tableName,
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: RemovalPolicy.DESTROY
    });
  }
}
