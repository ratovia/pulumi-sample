# AGENTS Guidelines

このリポジトリにおける開発方針を五つの柱でまとめます。

## 1. コーディングスタイル
- Node.js (TypeScript) で実装します。

## 2. テストと品質保証
- `PULUMI_CONFIG_PASSPHRASE="" pulumi preview` でエラーが出ないこと。
- `npx tsc` でエラーが起きないこと。

## 3. ブランチ命名規則
- 機能開発用ブランチは `feature/` プレフィックスを使用し、英語小文字で記述します。

## 4. ドキュメント更新ポリシー
- コードや設定を変更した際は `README.md` を更新します。

## 5. PR メッセージ
- Pull Request のタイトルと概要は日本語で記載します。
