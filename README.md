# pulumi-sample

このサンプルでは、Pulumi を使用して IAM ユーザー `ratovia` を作成します。

## セットアップ
1. Python 仮想環境を作成し、依存関係をインストールします。
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   ```
2. Pulumi スタックを初期化します。
   ```bash
   pulumi stack init dev
   ```

## デプロイ
以下のコマンドでユーザーを作成できます。
```bash
pulumi up
```

## クリーンアップ
作成したリソースを削除するには次のコマンドを実行します。
```bash
pulumi destroy
```
