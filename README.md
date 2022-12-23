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
