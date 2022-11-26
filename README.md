## 取得方法

```bash
git checkout main
git fetch origin
git branch -a
```
'feature/login-demo'がリモートブランチにあることを確認出来たら
以下のコマンドを実行。

```bash
git checkout feature/login-demo
git checkout [取り込みたいブランチ名]
git merge feature/login-demo
```

'login.ts'と'index.tsx'が更新される
