# pulumi-sample

This sample Pulumi program uses the Node.js runtime to deploy AWS resources.
It now provisions an IAM role that can perform `s3:GetObject` and `s3:PutObject` on the sample bucket.

## Deploying

Install the Node.js dependencies and run `pulumi up`.

```bash
npm install
pulumi up
```

## Development Guidelines
See [AGENTS.md](AGENTS.md) for coding style, testing requirements, and documentation policy.
