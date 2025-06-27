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
