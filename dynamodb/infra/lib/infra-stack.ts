import { Stack, StackProps, RemovalPolicy } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { AttributeType, BillingMode, Table } from 'aws-cdk-lib/aws-dynamodb';

export class InfraStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const table = new Table(scope, 'MainTable', {
      partitionKey: {
        name: 'partition_key',
        type: AttributeType.STRING,
      },
      sortKey: {
        name: 'sort_key',
        type: AttributeType.STRING,
      },
      tableName: 'main_table',
      billingMode: BillingMode.PAY_PER_REQUEST,
      removalPolicy: RemovalPolicy.DESTROY
    });

    // necesito una lambda para tener los resultados
    // un api gateway para las rutas
    // la apigateway dentro de vpc y con salida al exterior
  }
}
