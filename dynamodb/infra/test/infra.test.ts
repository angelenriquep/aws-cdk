// import * as cdk from 'aws-cdk-lib';
// import { Template } from 'aws-cdk-lib/assertions';
// import * as Infra from '../lib/infra-stack';

// example test. To run these tests, uncomment this file along with the
// example resource in lib/infra-stack.ts
test('SQS Queue Created', () => {
//   const app = new cdk.App();
//     // WHEN
//   const stack = new Infra.InfraStack(app, 'MyTestStack');
//     // THEN
//   const template = Template.fromStack(stack);

//   template.hasResourceProperties('AWS::SQS::Queue', {
//     VisibilityTimeout: 300
//   });


// const app = new App();
//   // WHEN
//   const stack = new CdkDynamoCustomLoaderStack(app, 'MyTestStack');
//   // THEN
//   expect(stack).to(
//     haveResource(
//       'AWS::DynamoDB::Table',
//       {
//         Properties: {
//           KeySchema: [
//             {
//               AttributeName: 'id',
//               KeyType: 'HASH',
//             },
//           ],
//           AttributeDefinitions: [
//             {
//               AttributeName: 'id',
//               AttributeType: 'S',
//             },
//           ],
//         },
//         UpdateReplacePolicy: 'Delete',
//         DeletionPolicy: 'Delete',
//       },
//       ResourcePart.CompleteDefinition,
//       true,
//     ),
//   );
// });

// test('Custom AWS Resources', () => {
//   const app = new App();
//   // WHEN
//   const stack = new CdkDynamoCustomLoaderStack(app, 'MyTestStack');
//   // THEN
//   expect(stack).to(
//     haveResource(
//       'Custom::AWS',
//       {
//         Create: { service: 'DynamoDB', action: 'putItem' },
//       },
//       ResourcePart.Properties,
//       true,
//     ),
//   );
//   expect(stack).to(
//     haveResource(
//       'Custom::AWS',
//       {
//         Create: { service: 'DynamoDB', action: 'batchWriteItem' },
//       },
//       ResourcePart.Properties,
//       true,
//     ),
//   );
//   expect(stack).to(countResources('Custom::AWS', 11));
});
