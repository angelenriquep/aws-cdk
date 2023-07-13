import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';

import { DynamoDB } from './DynamoDB';

export class InfraStack extends Stack {
  public readonly db: DynamoDB;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    this.db = new DynamoDB(this, 'DynamoDB');

    // necesito una lambda para tener los resultados
    // un api gateway para las rutas
    // la apigateway dentro de vpc y con salida al exterior
  }
}
