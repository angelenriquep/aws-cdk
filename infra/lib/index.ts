import { Stack, StackProps, CfnOutput, Duration } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Cluster, Ec2Service, Ec2TaskDefinition, ContainerImage } from 'aws-cdk-lib/aws-ecs';
import { Vpc, InstanceType, SubnetType } from 'aws-cdk-lib/aws-ec2';
import {
  ApplicationLoadBalancer,
  ApplicationProtocol,
  Protocol,
} from 'aws-cdk-lib/aws-elasticloadbalancingv2';

export class AwsCdkStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const vpc = new Vpc(this, 'MyVpc', {
      subnetConfiguration: [
        {
          cidrMask: 24,
          name: 'ingress',
          subnetType: SubnetType.PUBLIC,
        },
        {
          cidrMask: 24,
          name: 'compute',
          subnetType: SubnetType.PRIVATE_WITH_NAT,
        },
        {
          cidrMask: 28,
          name: 'rds',
          subnetType: SubnetType.PRIVATE_ISOLATED,
        },
      ],
    });

    // Create nuestra abstraccion que esta por encima de los ECS y que se
    // encargara del auto-escaler
    const cluster = new Cluster(this, 'MyCluster', {
      vpc: vpc,
    });

    cluster.addCapacity('DefaultAutoScalingGroup', {
      instanceType: new InstanceType('t2.micro'),
    });

    // Create a task definition for your container
    const taskDefinition = new Ec2TaskDefinition(this, 'MyTaskDef');

    const container = taskDefinition.addContainer('MyContainer', {
      image: ContainerImage.fromRegistry('containous/whoami'),
      memoryLimitMiB: 256,
      cpu: 128,
    });

    // Set the port on which the container listens
    container.addPortMappings({
      containerPort: 80,
    });

    // Create an EC2 service using the task definition
    const service = new Ec2Service(this, 'MyService', {
      cluster: cluster,
      taskDefinition: taskDefinition,
    });

    const load_balancer = new ApplicationLoadBalancer(this, 'LB', {
      vpc,
      internetFacing: true,
      loadBalancerName: 'lb-whatever',
    });
    // Pon a escuchar el load
    const listener = load_balancer.addListener('PublicListener', {
      port: 80,
      open: true,
    });

    // Pegale a las instancias ECS, lo hacemos por id al endpoint /helath
    listener.addTargets('ECS', {
      protocol: ApplicationProtocol.HTTP,
      targets: [
        service.loadBalancerTarget({
          containerName: 'MyContainer',
          containerPort: 80,
        }),
      ],
      healthCheck: {
        protocol: Protocol.HTTP,
        path: '/health',
        timeout: Duration.seconds(10),
        unhealthyThresholdCount: 5,
        healthyThresholdCount: 5,
        interval: Duration.seconds(60),
      },
    });


    new CfnOutput(this, 'BackendURL', {
      value: load_balancer.loadBalancerDnsName,
    });
  }
}
