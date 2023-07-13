import { RemovalPolicy } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as resources from 'aws-cdk-lib/custom-resources';
import * as fs from 'fs';
const path = require('path');

interface Record {
  userId: string;
  ranking: number;
  content: string;
}

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

    // Add 25 items at a time ten times.
    for (let i = 0; i < 10; i++) {
      new resources.AwsCustomResource(this, `initDBResourceBatch${i}`, {
        onCreate: {
          service: 'DynamoDB',
          action: 'batchWriteItem',
          parameters: { RequestItems: { [this.tableName]: this.generateBatch() } },
          physicalResourceId: resources.PhysicalResourceId.of(`initDBDataBatch${i}`),
        },
        policy: resources.AwsCustomResourcePolicy.fromSdkCalls({ resources: [this.table.tableArn] }),
      });
    }
  }

  private generateBatch = (batchSize = 25): { PutRequest: { Item: Record } }[] => {
    return new Array(batchSize).fill(undefined).map((_, index) => {
      return { PutRequest: { Item: this.readJSONLFile(index) } };
    });
  };

  // Consider use stream is the file is bigger to avoid exaust memory
  private readJSONLFile(lineNumber: number): Record {
    const fileContents = fs.readFileSync(path.join(__dirname, 'input.jsonl'), 'utf-8');
    const lines = fileContents.split('\n');
    
    console.log(lines)
    const line = lines[lineNumber];
    console.log(line, lineNumber)
  
    const record = JSON.parse(line) as Record;
    return record;
  }
}
