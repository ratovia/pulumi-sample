import pulumi
import pulumi_aws as aws

# Create an IAM user named "ratovia"
user = aws.iam.User('ratovia')

pulumi.export('user_name', user.name)
