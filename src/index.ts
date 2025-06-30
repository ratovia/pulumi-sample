import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";

// Create an IAM user named "ratovia"
const user = new aws.iam.User("ratovia");

// Create an S3 bucket
const bucket = new aws.s3.Bucket("sample-bucket");

// Create an IAM role with inline policy for S3 Get and Put
const role = new aws.iam.Role("s3-access-role", {
    assumeRolePolicy: JSON.stringify({
        Version: "2012-10-17",
        Statement: [
            {
                Action: "sts:AssumeRole",
                Principal: { Service: "ec2.amazonaws.com" },
                Effect: "Allow",
            },
        ],
    }),
});

const policy = new aws.iam.RolePolicy("s3-access-policy", {
    role: role.id,
    policy: pulumi.all([bucket.arn]).apply(([bucketArn]) =>
        JSON.stringify({
            Version: "2012-10-17",
            Statement: [
                {
                    Action: ["s3:GetObject", "s3:PutObject"],
                    Effect: "Allow",
                    Resource: `${bucketArn}/*`,
                },
            ],
        })
    ),
});

export const userName = user.name;
export const bucketName = bucket.bucket;
export const roleName = role.name;

// Create an ECR repository with image scanning on push enabled
const repository = new aws.ecr.Repository("sample-ecr-repo", {
    imageScanningConfiguration: {
        scanOnPush: true,
    },
});

export const repositoryName = repository.name;

// Create API Gateway REST API
const api = new aws.apigateway.RestApi("hoge-api", {
    description: "API Gateway with CORS support for POST /hoge",
});

// Create /hoge resource
const hogeResource = new aws.apigateway.Resource("hoge-resource", {
    restApi: api.id,
    parentId: api.rootResourceId,
    pathPart: "hoge",
});

// Create POST method for /hoge
const hogeMethod = new aws.apigateway.Method("hoge-post-method", {
    restApi: api.id,
    resourceId: hogeResource.id,
    httpMethod: "POST",
    authorization: "NONE",
});

// Create OPTIONS method for CORS preflight
const hogeOptionsMethod = new aws.apigateway.Method("hoge-options-method", {
    restApi: api.id,
    resourceId: hogeResource.id,
    httpMethod: "OPTIONS",
    authorization: "NONE",
});

// Create Lambda function for POST /hoge
const hogeFunction = new aws.lambda.Function("hoge-function", {
    code: new pulumi.asset.AssetArchive({
        ".": new pulumi.asset.StringAsset(`
exports.handler = async (event) => {
    return {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Origin": "https://example.com",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
        body: JSON.stringify({ message: "Hello from POST /hoge" }),
    };
};
        `),
    }),
    runtime: aws.lambda.Runtime.NodeJS18dX,
    handler: "index.handler",
    role: role.arn,
});

// Create integration for POST method
const hogeIntegration = new aws.apigateway.Integration("hoge-post-integration", {
    restApi: api.id,
    resourceId: hogeResource.id,
    httpMethod: hogeMethod.httpMethod,
    integrationHttpMethod: "POST",
    type: "AWS_PROXY",
    uri: hogeFunction.invokeArn,
});

// Create integration for OPTIONS method (CORS preflight)
const hogeOptionsIntegration = new aws.apigateway.Integration("hoge-options-integration", {
    restApi: api.id,
    resourceId: hogeResource.id,
    httpMethod: hogeOptionsMethod.httpMethod,
    type: "MOCK",
    requestTemplates: {
        "application/json": '{"statusCode": 200}',
    },
});

// Create method response for POST
const hogeMethodResponse = new aws.apigateway.MethodResponse("hoge-post-response", {
    restApi: api.id,
    resourceId: hogeResource.id,
    httpMethod: hogeMethod.httpMethod,
    statusCode: "200",
    responseParameters: {
        "method.response.header.Access-Control-Allow-Origin": true,
        "method.response.header.Access-Control-Allow-Methods": true,
        "method.response.header.Access-Control-Allow-Headers": true,
    },
});

// Create method response for OPTIONS
const hogeOptionsMethodResponse = new aws.apigateway.MethodResponse("hoge-options-response", {
    restApi: api.id,
    resourceId: hogeResource.id,
    httpMethod: hogeOptionsMethod.httpMethod,
    statusCode: "200",
    responseParameters: {
        "method.response.header.Access-Control-Allow-Origin": true,
        "method.response.header.Access-Control-Allow-Methods": true,
        "method.response.header.Access-Control-Allow-Headers": true,
    },
});

// Create integration response for POST
const hogeIntegrationResponse = new aws.apigateway.IntegrationResponse("hoge-post-integration-response", {
    restApi: api.id,
    resourceId: hogeResource.id,
    httpMethod: hogeMethod.httpMethod,
    statusCode: hogeMethodResponse.statusCode,
    responseParameters: {
        "method.response.header.Access-Control-Allow-Origin": "'https://example.com'",
        "method.response.header.Access-Control-Allow-Methods": "'POST, OPTIONS'",
        "method.response.header.Access-Control-Allow-Headers": "'Content-Type, Authorization'",
    },
});

// Create integration response for OPTIONS
const hogeOptionsIntegrationResponse = new aws.apigateway.IntegrationResponse("hoge-options-integration-response", {
    restApi: api.id,
    resourceId: hogeResource.id,
    httpMethod: hogeOptionsMethod.httpMethod,
    statusCode: hogeOptionsMethodResponse.statusCode,
    responseParameters: {
        "method.response.header.Access-Control-Allow-Origin": "'https://example.com'",
        "method.response.header.Access-Control-Allow-Methods": "'POST, OPTIONS'",
        "method.response.header.Access-Control-Allow-Headers": "'Content-Type, Authorization'",
    },
});

// Create deployment
const deployment = new aws.apigateway.Deployment("hoge-deployment", {
    restApi: api.id,
    stageName: "prod",
}, {
    dependsOn: [hogeIntegration, hogeOptionsIntegration, hogeIntegrationResponse, hogeOptionsIntegrationResponse],
});

// Grant API Gateway permission to invoke Lambda
const lambdaPermission = new aws.lambda.Permission("hoge-lambda-permission", {
    action: "lambda:InvokeFunction",
    function: hogeFunction.name,
    principal: "apigateway.amazonaws.com",
    sourceArn: pulumi.interpolate`${api.executionArn}/*/*`,
});

export const apiUrl = pulumi.interpolate`https://${api.id}.execute-api.${aws.config.region}.amazonaws.com/prod`;
