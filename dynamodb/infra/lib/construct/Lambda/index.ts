import { Construct } from 'constructs';
import { Duration, CfnOutput } from 'aws-cdk-lib';
import { Asset } from 'aws-cdk-lib/aws-s3-assets';
import * as lambda from 'aws-cdk-lib/aws-lambda';
const path = require('path');

export class LambdaLoader extends Construct {
  public readonly lambda: lambda.Function;

  constructor(scope: Construct, id: string, props: any) {
    super(scope, id);

    // Uploaded to Amazon S3 as-is
    const fileAsset = new Asset(this, 'SampleSingleFileAsset', {
      path: path.join(__dirname, 'input.jsonl'),
    });

    // Loader function
    this.lambda = new lambda.Function(this, "LambdaLoader", {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: "index.handler",
      timeout: Duration.seconds(30),
      code: lambda.Code.fromAsset(path.join(__dirname, 'handler')),
      environment: {
        TABLE_NAME: props.tableName,
        BUCKET_NAME: fileAsset.s3BucketName,
        OBJ_KEY: fileAsset.s3ObjectKey
      },
    });

    new CfnOutput(this, 'Bucket Name', { value: fileAsset.s3BucketName });
  }
}

