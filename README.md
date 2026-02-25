# myamioポータル

myamioのエンジニアポートフォリオ兼ポータルサイトです。

## 技術スタック
- Framework: Astro (latest)
- Styling: Tailwind CSS v4
- Deployment: GitHub Pages (GitHub Actions)

## 設計思想
- ステートレス
- メンテナンス性（YAMLでのコンテンツ管理）

## 開発方法

- npm install
- npm run dev

## デプロイ

main ブランチにプッシュされると GitHub Actions により自動的にデプロイされます。

## カスタマイズ

- `src/data/site.yml` を編集してプロフィールやリンクを変更できます。
- `public/avatar.png` を自身の画像に差し替えてください。
