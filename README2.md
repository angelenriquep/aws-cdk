# AWS CDK (Clound development kit)

Metete en IAM, selecciona el usuario y crea una access key
CLI esta bien y descarga el .csv

```sh
aws --version
aws configure --profile cdk
```

AWS Access Key ID [None]: AKIATOPKXM7UYHFRULUY
AWS Secret Access Key [None]: xxxxx
Default region name [None]: eu-south-2
Default output format [None]: json

```sh
aws configure list --profile cdk

npm install -g aws-cdk@2.25.0
cdk -h
cdk init --language typescript
tree -I node_modules
source .env/bin/activate
```

- README.md is essentially a Markdown documentation file. You must’ve come
  across it.
- The bin directory is essentially where the top-level CDK app files reside:
- chapter-1-introduction-to-iac-and-aws-cdk.ts is the file cdk created based on
  the name of the directory we ran the CLI init command in. This file contains
  the entry point of the application.
- cdk.json tells the toolkit how to run the application and passes along some
  further configurations.
- jest.config.js is the configuration file the cdk library uses to run local
  tests.
- lib contains all the goodies. All the constructs we will be creating for our
  project will be placed inside here, as outlined next:
- chapter-1-introduction-to-iac-and-aws-cdk-stack.ts is one such construct or
  component. In this chapter, we will be spending most of our time here.
- You can safely ignore package-lock.json for now; it’s what npm uses to keep
  track of specific versions of node libraries installed.
- package.json is the npm module’s manifest information such as app, versions,
  dependencies, and so on.
- test is pretty self-explanatory. Our test files reside here, as detailed next:
- chapter-1-introduction-to-iac-and-aws-cdk.test.ts: cdk has gone ahead and
  created a test file for us, urging us to test our application. We will do so
  in later chapters.
- tsconfig.json is where TypeScript-specific configuration is stored.

```sh
# This command will bootstrap the AWS environment, meaning it will create all the necessary AWS resources on the cloud to make CDK work properly. It will also keep you informed of the progress. If your user has got the necessary permissions, esto ademas nos entregara unos links para ver donde esta desplegado.

cdk bootstrap --profile cdk
cdk destroy --profile cdk

# Returns the CloudFormation yaml, hazo dentro de la carpeta de infra
cdk synth
```

Siempre tnemos que crear la app, y despues pasamos nuestra instancia a todos los
recursos:

const app = new cdk.App();

- L1: Short for layer 1, also called CFN resources, are low-level constructs
  that directly match CloudFormation declarations of AWS services one to one.
  They are all prefixed with Cfn (for example, CfnBucket, representing
  AWS::S3::Bucket).
- L2: The next higher-level constructs of the CDK library are built on top of L1
  constructs, and they come with boilerplates, defaults, Glue code, and helper
  functions for convenience. An example of this would be s3.Bucket
  (<https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_s3.Bucket.html>),
  which comes with helper functions such as bucket.grantPublicAccess() that
  internally take care of the complexities of the S3 bucket which is public.
- L3: One level higher; these constructs are also called patterns. They are more
  complex best practice patterns that can be used to spin up complex structures
  of AWS services with sensible defaults. We used one such L3 construct in
  Chapter 1. ApplicationLoadBalancedFargateService is an L3 construct that sets
  up a load-balanced Elastic Container Service (ECS) Fargate container service.

## Buy a domain in Route 53

You will see a screen where you can type in a domain name of your liking with the domain extension .com preselected. At the time of writing, this costs $12:

Figure 4.1 – Route 53 domain search page
Figure 4.1 – Route 53 domain search page

The simplest way of completing this chapter is by choosing the .click domain extension, which only costs $3, and registering a domain. It might also come in handy in your future testing or perhaps when you’re launching a start-up. Now that you know CDK, you can launch it quickly.

Wow, look at this! We found an awesome cdkbook.click domain. Let’s go ahead and add it to the cart and go to the checkout. Business expenses be damned!

Figure 4.2 – Buying an affordable domain
Figure 4.2 – Buying an affordable domain

Go ahead and give our internet overlords your address details to register the domain. Once registered, click Go Back to Domains. You will see the domain name waiting under Pending requests.

Apologies

We’re sorry to make you do all this. As you might have noticed, .click domain extensions don’t have a WHOIS privacy option. We guess we get what we pay for. Registering a domain via AWS is the simplest way, but you can also have AWS manage the DNS for another domain you might have. Details can be found at <https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/migrate-dns-domain-in-use.html>.

While we wait for our pending domain to brew, let’s go ahead and prepare the rest of this project
