# pulumi-sample

This project deploys an AWS S3 bucket using [Pulumi](https://www.pulumi.com/).

## Prerequisites

- Python 3.7+
- Pulumi CLI
- AWS credentials configured

## Usage

Install dependencies:

```bash
pip install -r requirements.txt
```

Preview the deployment:

```bash
pulumi preview
```

Deploy the stack:

```bash
pulumi up
```

The bucket name is exported as `bucket_name`.

