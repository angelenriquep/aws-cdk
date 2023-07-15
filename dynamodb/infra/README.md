# DynamoDB Ranking Deploy

When you deploy the stack, it will create the VPC, DynamoDB table, Lambda
function, and use the AwsCustomResource to invoke the Lambda function with the
payload containing the table ARN and data for loading into the table, all within
the VPC.

Ensures queries in O(1) saving the order based on raning for the users's
content.

If your Lambda function only needs to connect to DynamoDB, then it would be
wrong to place the Lambda function in a VPC.

If your Lambda function needs to access an EC2 instance or an RDS instance or
some other service running inside the VPC, and also needs to connect to
DynamoDB, then the Lambda function would have to run in the VPC and you would
need to provide access to DynamoDB via a VPC Endpoint or a NAT Gateway.

Investigate if we can use Bucket event to trigger the lambda and remove the
custom resource lambds been more cost-effective.

## Useful commands

* `npm run build`           compile typescript to js
* `npm run watch`           watch for changes and compile
* `npm run test`            perform the jest unit tests
* `cdk diff`                compare deployed stack with current state
* `cdk synth`               emits the synthesized CloudFormation template
* `export AWS_PROFILE=cdk`
* `dk deploy --profile cdk` deploy this stack to your default AWS account/region
* `dk destroy --profile cdk` destroy this stack to your default AWS account/region
