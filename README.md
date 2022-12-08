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

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).


## エラー解消について

### Cannot set headers after they are sent to the client
responseを返却する際に、２度返却してしまうと発生する。
if elseを使用して、必ず一回になるようにする。
