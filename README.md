## vercelデプロイ後のpush作業について
- 作業branch → vercelで確認 → mainにpushの手順でpushします

1. vercel用のrepositoryにpush
```bash
git push -u [origin以外の名前] [作業branch]
```
2. vercel用のrepositoryプルリク作るとVercelでプレビュー見れるのでプレビューで問題ないか確認
3. 確認出来たら、merge
4. team-festivalにpush
```bash
git push -u origin [作業branch]
```

5. マージされたらローカル環境を最新化
```bash
git fetch origin
git merge origin/main
```
※他の人の変更を取り込んだら都度vercelを更新しておきましょう!!!

## vercel デプロイ手順

Repositry の fork を行います。

1. team-festival ローカル環境の mainを最新化しておきましょう(一応)

```bash
git checkout main
git fetch
git merge
```

2. 自分のアカウントに private の repository を新規作成

3. 事前確認  
origin のみであることを確認する

```bash
git remote -v
```

4. team-festival ローカル環境の main で以下のコマンドを実行

```bash
git remote add [origin以外の名前] [private repositoryの接続情報（git@github~）]
```

5. 事後確認  
4 で指定した origin 以外のやつが追加されていることを確認する

```bash
git remote -v
```

6. main を push 出来るようにする

```bash
rm -rf .git-hooks
```

7. push

```bash
git push -u [origin以外の名前] main
```

8. 2 で作った repository に team-festival があることを確認

9. vercel にログインすると『import Git Repository』に team-festival があるので、import 押下

10. 『Environment Variables』に以下を追加  

```text
【key】：BASIC_AUTH_USER,【value】：DeepImpact  

【key】：BASIC_AUTH_PASSWORD,【value】：qwer1234@ 

【key】：NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
【value】：pk_test_51M6tm0JFPEa78RWS0X90L3VfCkwAkxHTPmmmDsfYFts1PIdB92NHhMaBA9AxJxXXIUkCQdYdvpSs3kOn1AvN01mU00qpRLiEcc

【key】：STRIPE_SECRET_KEY
【value】：sk_test_51M6tm0JFPEa78RWSflSA01QTcSMESwLysJQMMLSFy2Bg4wepJXO22VSDDlT568JpblDBY9gjddDyiaGv8p8F8aQS002jiOyS2X
```

11. 戻す
```bash
git restore .git-hooks/pre-push
```

## DB導入について

### ローカル環境でやること
```bash
yarn 
yarn prisma generate
```
- 拡張機能『Prisma』のインストール 

DBのデータ確認、修正
```bash
yarn prisma studio
```

### 紹介
- vercel
  - ホスティングサービス
- prisma
  - ORM（Object-Rerational Mapping）
- Supabase
  - データベースプラットフォーム
- postgresSQL
  - データベース

### ORMのメリット
- SQLを記述する手間が省ける
- SQLインジェクション対策やってくれる
- データベース接続設定が簡単に共通化できる

#### 参考
[Prisma Docs](https://www.prisma.io/docs/concepts/components/prisma-client/crud#include-related-records)  
[Prisma チートシート](https://qiita.com/koffee0522/items/92be1826f1a150bfe62e)  
[初期構築の参考サイト](https://vercel.com/guides/nextjs-prisma-postgres)  
[PrismaのGitHub](https://github.com/prisma/prisma)



## ダミー決済の入力情報について
- カード番号
  - 4242 4242 4242 4242
- 有効期限
  - 未来日付ならいつでも良い
- セキュリティコード
  - 3桁何でもよい（はず）

## stripeモジュールについて
```basn
yarn add stripe @stripe/stripe-js next
```


## エラー解消について

### Cannot set headers after they are sent to the client
responseを返却する際に、２度返却してしまうと発生する。
if elseを使用して、必ず一回になるようにする。
