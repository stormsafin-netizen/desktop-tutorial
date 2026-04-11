# AI CEO 経営システム

Claude Codeを使ったAI CEO経営システムです。

## 会社構造

```
創業者（コンテンツ制作・最終意思決定）
        ↕
    AI CEO（Claude Code）
    ├── 毎日の経営方針・報告
    ├── 採用管理（Gmail + Google Calendar）
    └── 財務管理
```

## ディレクトリ構成

```
company/
├── strategy/          # 会社戦略・プロフィール
├── hr/                # 採用管理・候補者台帳
├── finance/           # 収支台帳・財務レポート
├── content/           # コンテンツ計画
└── daily-reports/     # 日次経営レポート
```

## CEOへの指示方法

Claude Codeに話しかけるだけでOKです。例：

- 「今日のレポートを作って」
- 「Gmailの応募メールを確認して、candidates.mdに追加して」
- 「来週の面接をGoogle Calendarに入れて」
- 「今月の収支をまとめて」

## ツール連携

| ツール | 用途 |
|--------|------|
| Gmail | 応募メール確認、採用連絡 |
| Google Calendar | 面接・MTGのスケジュール管理 |

## ルール

- 1万円以上の支出は創業者の承認が必要
- 採用の最終決定は創業者が行う
- すべての決定はGitでログ管理
