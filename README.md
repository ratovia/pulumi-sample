# pulumi-sample

This repository contains a minimal Pulumi project for learning the basics.

## Prerequisites

- [Node.js](https://nodejs.org/) 12 or newer
- [Pulumi CLI](https://www.pulumi.com/docs/get-started/install/)

Install the Pulumi CLI:

```bash
curl -fsSL https://get.pulumi.com | sh
```

## Getting Started

1. Install project dependencies:

```bash
npm install
```

2. Log in to the Pulumi CLI (using the local backend):

```bash
pulumi login --local
```

3. Preview the stack and deploy it:

```bash
pulumi up
```

The deployment exports a single value named `message`.

To clean up the stack, run:

```bash
pulumi destroy
```

