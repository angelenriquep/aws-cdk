import { RemovalPolicy, Duration } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as resources from 'aws-cdk-lib/custom-resources';
import * as fs from 'fs';
const path = require('path');
import { Asset } from 'aws-cdk-lib/aws-s3-assets';

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

    // Uploaded to Amazon S3 as-is
    const fileAsset = new Asset(this, 'SampleSingleFileAsset', {
      path: path.join(__dirname, 'input.jsonl')
    });

    let resource = null;

    // Add 25 items at a time two times.
    for (let i = 0; i < 2; i++) {
      resource = new resources.AwsCustomResource(this, `initDBResourceBatch${i}`, {
        onCreate: {
          service: 'DynamoDB',
          action: 'batchWriteItem',
          parameters: { RequestItems: { [this.tableName]: this.generateBatch(25, fileAsset) } },
          physicalResourceId: resources.PhysicalResourceId.of(`initDBDataBatch${i}`),
        },
        policy: resources.AwsCustomResourcePolicy.fromSdkCalls({ resources: [this.table.tableArn] }),
        timeout: Duration.minutes(10),
      });
    }

    resource && resource.node.addDependency(fileAsset);
    fileAsset.grantRead(resource)

  }

  private generateBatch = (batchSize: number, fileAsset: Asset): { PutRequest: { Item: Record } }[] => {
    return new Array(batchSize).fill(undefined).map((_, index) => {
      return { PutRequest: { Item: this.readJSONLFile(index, fileAsset) } };
    });
  };

  // Consider use stream is the file is bigger to avoid exaust memory
  private readJSONLFile(lineNumber: number, fileAsset: Asset): Record {
    const fileContents = fs.readFileSync(fileAsset.assetPath, 'utf-8');
    const lines = fileContents.split('\n');

    const line = lines[lineNumber];

    const record = JSON.parse(line) as Record;
    return record;
  }
}
