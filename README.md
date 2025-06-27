# pulumi-sample

This sample Pulumi program uses the Node.js runtime to deploy AWS resources.
It now provisions an IAM role that can perform `s3:GetObject` and `s3:PutObject` on the sample bucket, and also creates an Amazon ECR repository.

## Deploying

Install the Node.js dependencies and run `pulumi up`.

```bash
npm install
pulumi up
```

### Makefile でのビルドとプレビュー

以下のコマンドで TypeScript のコンパイルと `pulumi preview` を実行できます。

```bash
make preview
```


## Development Guidelines
See [AGENTS.md](AGENTS.md) for coding style, testing requirements, and documentation policy.
