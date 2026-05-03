import enUS from './en-US';

export default {
  ...enUS,
  "title": "macOS風Dock",
  "subtitle": "Dockアイコンにホバーすると拡大効果を確認できます",
  "common": {
    "loading": "読み込み中",
    "ok": "OK",
    "cancel": "キャンセル",
    "close": "閉じる",
    "success": "成功"
  },
  "settings": {
    ...enUS.settings,
    "title": "設定",
    "autoHide": "自動的に隠す",
    "autoHideDesc": "マウスが離れたらDockを自動的に隠します",
    "triggerDistance": "表示距離",
    "triggerDistanceDesc": "マウスが下端からこの距離以内に入るとDockを表示します",
    "pixels": "ピクセル",
    "resetToDefault": "初期設定に戻す",
    "resetConfirm": "初期設定に戻しますか？",
    "language": "言語",
    "languageDesc": "インターフェース言語を選択",
    "dockSection": "Dock設定",
    "generalSection": "一般設定",
    "commandPaletteSection": "コマンドパレット",
    "searchOpenTarget": "検索結果の開き方",
    "searchOpenTargetDesc": "コマンドパレットとホーム検索の結果を開く場所を選択します",
    "searchOpenTargets": {
      "newWindow": "新しいウィンドウ",
      "newTab": "新しいタブ",
      "currentTab": "現在のタブ"
    },
    "reset": {
      "success": "設定を初期状態に戻しました"
    },
    "resetSuccessTitle": "通知",
    "resetSuccessContent": "設定を初期状態に戻しました"
  },
  "components": {
    ...enUS.components,
    "components": "コンポーネント",
    "sidebar": {
      "title": "コンポーネントパネル",
      "searchPlaceholder": "コンポーネントを検索..."
    },
    "groups": {
      "layout": "レイアウト",
      "container": "コンテナ",
      "feature": "機能"
    },
    "items": {
      "baseLayout": "レイアウト",
      "baseSection": "セクション",
      "baseSwiper": "カルーセル",
      "baseNavbar": "ナビゲーションバー",
      "baseSearchBar": "検索ボックス",
      "basePopular": "人気",
      "baseFavorite": "お気に入り",
      "baseAt": "メール",
      "baseCode": "コードスニペット",
      "baseQrcode": "QRコード",
      "baseLink": "リンク"
    },
    "operator": {
      "openComponents": "コンポーネントパネルを開く",
      "cancelEdit": "編集をキャンセル",
      "saveEdit": "編集を保存",
      "keepEditing": "編集を続ける",
      "cancelConfirm": "編集をキャンセルしますか？",
      "saveConfirm": "編集を保存しますか？"
    }
  },
  "layout": {
    "editor": "レイアウトエディタ",
    "loadingComponent": "{{component}} を読み込み中...",
    "missingConfig": "コンポーネント設定が見つかりません",
    "unregisteredComponent": "未登録のコンポーネント: {{component}}"
  },
  "search": {
    "placeholder": "検索、または g / gh / npm などの接頭辞を入力",
    "submit": "検索"
  },
  "commandPalette": {
    ...enUS.commandPalette,
    "title": "コマンドパレット",
    "placeholder": "検索またはコマンドを実行。例: g React、gh vite、npm arco",
    "empty": "一致するコマンドがありません",
    "commands": {
      "home": "ホームを開く",
      "layoutEdit": "レイアウトを編集",
      "settings": "設定を開く",
      "about": "情報"
    },
    "descriptions": {
      "home": "新しいタブのホームに戻る",
      "layoutEdit": "レイアウトエディタを開く",
      "settings": "拡張機能の設定を管理",
      "about": "プロジェクト情報を見る",
      "defaultSearch": "{{engine}} で検索",
      "prefixedSearch": "{{engine}} で検索、接頭辞 {{prefix}}",
      "engineHint": "{{prefix}} キーワード と入力してこの検索エンジンを使用"
    },
    "footer": {
      "navigate": "↑↓ 選択",
      "confirm": "Enter 実行"
    }
  },
  "drawer": {
    "title": "メニュー",
    "section1": "クイック操作",
    "content1": "よく使うツールやショートカットにアクセスできます。",
    "section2": "最近の項目",
    "content2": "最近アクセスしたファイルやドキュメントを確認できます。",
    "section3": "ヘルプとサポート",
    "content3": "ヘルプを取得し、利用可能な機能を確認できます。"
  }
} as const;
