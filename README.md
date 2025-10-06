# Next.js SaaSスターター

これは、認証、決済のための Stripe 連携、ログインユーザー向けダッシュボードに対応した、**Next.js** を用いた SaaS アプリケーション構築用スターターテンプレートです。

**デモ: [https://next-saas-start.vercel.app/](https://next-saas-start.vercel.app/)**

## 機能

- アニメーションするターミナル要素を備えたマーケティング用ランディングページ（`/`）
- Stripe Checkout と連携する料金ページ（`/pricing`）
- ユーザー/チームに対する CRUD 操作を備えたダッシュボード
- Owner と Member ロールによる基本的な RBAC
- Stripe Customer Portal によるサブスクリプション管理
- Cookie に保存された JWT を用いたメール/パスワード認証
- ログイン必須ルートを保護するグローバルミドルウェア
- Server Actions の保護や Zod スキーマ検証を行うローカルミドルウェア
- ユーザーイベントの活動ログシステム

## 技術スタック

- **フレームワーク**: [Next.js](https://nextjs.org/)
- **データベース**: [Postgres](https://www.postgresql.org/)
- **ORM**: [Drizzle](https://orm.drizzle.team/)
- **決済**: [Stripe](https://stripe.com/)
- **UI ライブラリ**: [shadcn/ui](https://ui.shadcn.com/)

## はじめに

```bash
git clone https://github.com/nextjs/saas-starter
cd saas-starter
pnpm install
```

## ローカルでの実行

[インストール](https://docs.stripe.com/stripe-cli) して Stripe アカウントにログインします:

```bash
stripe login
```

同梱のセットアップスクリプトで `.env` ファイルを作成します:

```bash
pnpm db:setup
```

データベースマイグレーションを実行し、初期ユーザーとチームでシードします:

```bash
pnpm db:migrate
pnpm db:seed
```

次のユーザーとチームが作成されます:

- ユーザー: `test@test.com`
- パスワード: `admin123`

`/sign-up` ルートから新規ユーザーを作成することもできます。

最後に、Next.js の開発サーバーを起動します:

```bash
pnpm dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開くとアプリを確認できます。

Stripe CLI を使ってローカルで Webhook を待ち受け、サブスクリプション変更イベントを処理できます:

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

## 決済のテスト

Stripe 決済をテストするには、次のテストカード情報を使用します:

- カード番号: `4242 4242 4242 4242`
- 有効期限: 将来の日付なら任意
- CVC: 任意の 3 桁

## 本番環境へ

本番へデプロイする準備ができたら、次の手順に従ってください:

### 本番用の Stripe Webhook を設定する

1. Stripe ダッシュボードで本番環境用の Webhook を作成します。
2. エンドポイント URL を本番の API ルートに設定します（例: `https://yourdomain.com/api/stripe/webhook`）。
3. 待ち受けたいイベントを選択します（例: `checkout.session.completed`, `customer.subscription.updated`）。

### Vercel にデプロイ

1. コードを GitHub リポジトリにプッシュします。
2. リポジトリを [Vercel](https://vercel.com/) に接続してデプロイします。
3. Vercel のデプロイ手順に従い、プロジェクトのセットアップを完了します。

### 環境変数を追加

Vercel のプロジェクト設定（またはデプロイ時）で必要な環境変数を追加します。本番環境用の値に更新してください。例:

1. `BASE_URL`: 本番ドメインを設定
2. `STRIPE_SECRET_KEY`: 本番用の Stripe シークレットキー
3. `STRIPE_WEBHOOK_SECRET`: 手順 1 で作成した本番 Webhook のシークレット
4. `POSTGRES_URL`: 本番データベースの URL
5. `AUTH_SECRET`: ランダムな文字列を設定（`openssl rand -base64 32` で生成可能）

## 他のテンプレート

このテンプレートは学習用に最小限ですが、より多機能な有料版もあります:

- https://achromatic.dev
- https://shipfa.st
- https://makerkit.dev
- https://zerotoshipped.com
- https://turbostarter.dev
