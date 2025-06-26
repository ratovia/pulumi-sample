import pulumi
import pulumi_aws as aws

bucket = aws.s3.Bucket(
    "s3-test-bucket",
    bucket="s3-test-bucket",
)

pulumi.export("bucket_name", bucket.bucket)
