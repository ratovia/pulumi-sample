import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";

// Create an IAM user named "ratovia"
const user = new aws.iam.User("ratovia");

// Create an S3 bucket
const bucket = new aws.s3.Bucket("sample-bucket");

export const userName = user.name;
export const bucketName = bucket.bucket;
