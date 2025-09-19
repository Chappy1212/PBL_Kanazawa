# FY25-app-template

TypeScript + express.js + PostgreSQL のスケルトンコードです

以下を設定してあります
- jest
- ESLint
- CI と AWS Lightsail へのデプロイ (GitHub Actions)

以下の npn スクリプトが利用できます
- npm run dev ... 開発モードでアプリを起動します (port:3000)
- npm run build ... アプリをトランスパイルして dist フォルダに出力します
- npm run start ... トランスパイルされたアプリをプロダクションモードで起動します (port:3000)
- npm run lint ... ESLint のチェックと自動修正を実行します
- npm run lint:check ...  ESLint のチェックを実行します
- npm run test ... jest のテストを実行します (spec/* と tests/* のファイルを対象)
- npm run test:unit ... jest のテストを実行します (spec/* のファイルを対象)
- npm run test:e2e ... jest のテストを実行します (tests/* のファイルを対象)
- npm run db:init ... データベースの初期化を行います
- npm run clean ... dist フォルダを削除します


他のフレームワークを利用しても構いませんが、デプロイスクリプトとAWS Lightsail 環境での R-WAN 制限実装の都合上、以下で動作することを守ってください

1. npm run lint で ESLint のチェックが通ること
2. npm run test でテストが通ること
3. npm run build で dist フォルダにトランスパイルされること
    - dist/* はコミットする必要はありません. CI/CDの際に自動で生成します
4. npm start でプロダクションモードでアプリが port:3000 で起動すること
