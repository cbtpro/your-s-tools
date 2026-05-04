export default {
  "title": "MacOS 风格 Dock",
  "subtitle": "将鼠标悬停在 Dock 图标上以查看放大效果",
  "common": {
    "loading": "加载中",
    "ok": "确定",
    "cancel": "取消",
    "close": "关闭",
    "success": "成功"
  },
  "languages": {
    "zh-CN": "中文",
    "en-US": "English",
    "ja-JP": "日本語",
    "de-DE": "Deutsch",
    "es-ES": "Español",
    "ru-RU": "Русский"
  },
  "features": {
    "title": "功能特性",
    "item1": "悬停时平滑放大",
    "item2": "活动状态指示器",
    "item3": "Arco Design 工具提示",
    "item4": "玻璃态设计",
    "item5": "自动隐藏功能"
  },
  "technology": {
    "title": "技术栈",
    "item1": "Vite + React + TypeScript",
    "item2": "Arco Design 组件",
    "item3": "Tailwind CSS 样式",
    "item4": "Lucide React 图标"
  },
  "description": "点击任意 Dock 图标将其标记为活动状态。放大效果会根据距离影响相邻图标。",
  "settings": {
    "title": "设置",
    "autoHide": "自动隐藏",
    "autoHideDesc": "鼠标移开时自动隐藏 Dock",
    "triggerDistance": "触发距离",
    "triggerDistanceDesc": "鼠标距底部多少像素时显示 Dock",
    "pixels": "像素",
    "maxVisibleIcons": "最大可见图标数",
    "maxVisibleIconsDesc": "超过此数量时将启用横向滚动",
    "resetToDefault": "恢复默认",
    "resetConfirm": "确定要恢复默认设置吗？",
    "language": "语言",
    "languageDesc": "选择界面语言",
    "dockSection": "Dock 设置",
    "generalSection": "通用设置",
    "commandPaletteSection": "命令面板",
    "searchOpenTarget": "搜索结果打开方式",
    "searchOpenTargetDesc": "控制命令面板和首页搜索框打开搜索结果的位置",
    "searchOpenTargets": {
      "newWindow": "新窗口",
      "newTab": "新标签页",
      "currentTab": "当前页"
    },
    "resetSuccessTitle": "消息",
    "resetSuccessContent": "设置已恢复默认",
    "reset": {
      "success": "设置已恢复默认"
    }
  },
  "components": {
    "components": "组件",
    "sidebar": {
      "title": "组件面板",
      "searchPlaceholder": "搜索组件..."
    },
    "groups": {
      "layout": "布局",
      "container": "容器",
      "feature": "功能"
    },
    "items": {
      "baseLayout": "布局",
      "baseSection": "分组",
      "baseSwiper": "轮播",
      "baseNavbar": "导航栏",
      "baseSearchBar": "搜索框",
      "basePopular": "热门推荐",
      "baseFavorite": "收藏夹",
      "baseAt": "邮箱",
      "baseCode": "代码片段",
      "baseQrcode": "二维码",
      "baseLink": "网址"
    },
    "operator": {
      "openComponents": "打开组件面板",
      "cancelEdit": "取消编辑",
      "saveEdit": "保存编辑",
      "keepEditing": "继续编辑",
      "cancelConfirm": "确定要取消编辑吗？",
      "saveConfirm": "确定要保存编辑吗？"
    }
  },
  "layout": {
    "editor": "布局编辑器",
    "loadingComponent": "正在加载 {{component}}...",
    "missingConfig": "组件配置丢失",
    "unregisteredComponent": "组件未注册：{{component}}"
  },
  "search": {
    "placeholder": "搜索，或输入 g / gh / npm 前缀",
    "submit": "搜索"
  },
  "qrcode": {
    "protocol": "二维码类型",
    "open": "打开二维码",
    "displayMode": "显示状态",
    "editMode": "编辑状态",
    "edit": "编辑",
    "save": "保存",
    "cancelEdit": "取消",
    "history": "历史",
    "deleteHistory": "删除历史",
    "currentContent": "当前内容",
    "unsaved": "尚未保存，默认进入编辑状态",
    "savedAt": "已保存 {{time}}",
    "copy": "复制内容",
    "tooLong": "内容过长，暂时无法生成二维码",
    "unavailable": "请输入内容生成二维码",
    "protocols": {
      "text": "文本",
      "url": "网址",
      "wifi": "Wi-Fi",
      "email": "邮箱",
      "phone": "电话",
      "sms": "短信",
      "vcard": "联系人",
      "geo": "地理位置",
      "event": "日程"
    },
    "fields": {
      "displayName": "组件名称",
      "text": "文本内容",
      "url": "网址",
      "ssid": "网络名称",
      "password": "密码",
      "encryption": "加密类型",
      "hidden": "隐藏网络",
      "none": "无密码",
      "yes": "是",
      "no": "否",
      "email": "邮箱地址",
      "subject": "主题",
      "body": "正文",
      "phone": "电话号码",
      "message": "消息",
      "name": "姓名",
      "latitude": "纬度",
      "longitude": "经度",
      "eventTitle": "日程标题",
      "location": "地点",
      "startTime": "开始时间",
      "endTime": "结束时间"
    }
  },
  "code": {
    "open": "打开代码片段",
    "add": "新增",
    "copy": "复制",
    "format": "格式化",
    "delete": "删除",
    "done": "完成",
    "empty": "暂无代码片段",
    "untitled": "未命名片段",
    "snippetCount": "{{count}} 个代码片段",
    "formatUnsupported": "当前语言暂不支持格式化",
    "formatFailed": "格式化失败，请检查代码语法",
    "fields": {
      "displayName": "组件名称",
      "title": "标题",
      "language": "语言",
      "code": "代码"
    },
    "languages": {
      "typescript": "TypeScript",
      "javascript": "JavaScript",
      "json": "JSON",
      "css": "CSS",
      "html": "HTML",
      "markdown": "Markdown",
      "sql": "SQL",
      "shell": "Shell",
      "text": "文本"
    }
  },
  "link": {
    "open": "打开网址",
    "add": "新增",
    "copy": "复制",
    "visit": "访问",
    "delete": "删除",
    "done": "完成",
    "pin": "置顶",
    "unpin": "取消置顶",
    "search": "搜索网址",
    "empty": "暂无网址",
    "untitled": "未命名网址",
    "linkCount": "{{count}} 个网址",
    "fields": {
      "displayName": "组件名称",
      "title": "标题",
      "url": "网址",
      "iconUrl": "图片地址（留空自动获取 favicon）",
      "description": "描述",
      "tags": "标签，使用逗号分隔"
    }
  },
  "commandPalette": {
    "title": "命令面板",
    "placeholder": "搜索或执行命令，例如：g React、gh vite、npm arco",
    "empty": "没有匹配的命令",
    "commands": {
      "home": "打开主页",
      "layoutEdit": "编辑布局",
      "settings": "打开设置",
      "about": "关于"
    },
    "descriptions": {
      "home": "返回新标签页主页",
      "layoutEdit": "打开布局编辑器",
      "settings": "管理插件设置",
      "about": "查看项目信息",
      "defaultSearch": "使用 {{engine}} 搜索",
      "prefixedSearch": "使用 {{engine}} 搜索，前缀 {{prefix}}",
      "engineHint": "输入 {{prefix}} 关键词 使用这个搜索引擎"
    },
    "engines": {
      "google": "Google",
      "baidu": "百度",
      "bing": "Bing",
      "duckduckgo": "DuckDuckGo",
      "github": "GitHub",
      "npm": "npm",
      "mdn": "MDN"
    },
    "footer": {
      "navigate": "↑↓ 选择",
      "confirm": "Enter 执行"
    }
  },
  "apps": {
    "name": "Your's Tools",
    "home": "主页",
    "mail": "邮件",
    "calendar": "日历",
    "documents": "文档",
    "team": "团队",
    "photos": "照片",
    "music": "音乐",
    "videos": "视频",
    "files": "文件",
    "settings": "设置",
    "tools": "工具",
    "customize": "个性化",
    "help": "帮助",
    "about": "关于"
  },
  "drawer": {
    "title": "菜单",
    "section1": "快捷操作",
    "content1": "从这里访问常用工具和快捷方式。",
    "section2": "最近项目",
    "content2": "查看您最近访问的文件和文档。",
    "section3": "帮助与支持",
    "content3": "获取帮助并了解更多可用功能。"
  }
} as const;
