export default {
  "title": "MacOS Style Dock",
  "subtitle": "Hover over the dock icons to see the magnification effect",
  "common": {
    "loading": "Loading",
    "ok": "OK",
    "cancel": "Cancel",
    "close": "Close",
    "success": "Success"
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
    "title": "Features",
    "item1": "Smooth magnification on hover",
    "item2": "Active state indicators",
    "item3": "Tooltip labels with Arco Design",
    "item4": "Glassmorphism design",
    "item5": "Auto-hide functionality"
  },
  "technology": {
    "title": "Technology",
    "item1": "Vite + React + TypeScript",
    "item2": "Arco Design Components",
    "item3": "Tailwind CSS Styling",
    "item4": "Lucide React Icons"
  },
  "description": "Click on any dock icon to mark it as active. The magnification effect applies to neighboring icons based on proximity.",
  "settings": {
    "title": "Settings",
    "autoHide": "Auto Hide",
    "autoHideDesc": "Automatically hide Dock when mouse is away",
    "triggerDistance": "Trigger Distance",
    "triggerDistanceDesc": "Show Dock when mouse is within this distance from bottom",
    "pixels": "pixels",
    "maxVisibleIcons": "Max Visible Icons",
    "maxVisibleIconsDesc": "Enable horizontal scroll when exceeding this number",
    "resetToDefault": "Reset to Default",
    "resetConfirm": "Are you sure you want to reset to default settings?",
    "language": "Language",
    "languageDesc": "Select interface language",
    "dockSection": "Dock Settings",
    "generalSection": "General Settings",
    "commandPaletteSection": "Command Palette",
    "searchOpenTarget": "Search result target",
    "searchOpenTargetDesc": "Choose where command palette and home search results open",
    "searchOpenTargets": {
      "newWindow": "New window",
      "newTab": "New tab",
      "currentTab": "Current tab"
    },
    "resetSuccessTitle": "Notice",
    "resetSuccessContent": "Settings have been reset to default",
    "reset": {
      "success": "Settings have been reset to default"
    }
  },
  "components": {
    "components": "Components",
    "sidebar": {
      "title": "Component panel",
      "searchPlaceholder": "Search components..."
    },
    "groups": {
      "layout": "Layout",
      "container": "Containers",
      "feature": "Features"
    },
    "items": {
      "baseLayout": "Layout",
      "baseSection": "Section",
      "baseSwiper": "Carousel",
      "baseNavbar": "Navigation bar",
      "baseSearchBar": "Search box",
      "basePopular": "Popular",
      "baseFavorite": "Favorites",
      "baseAt": "Email",
      "baseCode": "Code snippet",
      "baseQrcode": "QR code",
      "baseLink": "Link"
    },
    "operator": {
      "openComponents": "Open component panel",
      "cancelEdit": "Cancel editing",
      "saveEdit": "Save edits",
      "keepEditing": "Keep editing",
      "cancelConfirm": "Are you sure you want to cancel editing?",
      "saveConfirm": "Are you sure you want to save your edits?"
    }
  },
  "layout": {
    "editor": "Layout editor",
    "loadingComponent": "Loading {{component}}...",
    "missingConfig": "Component configuration is missing",
    "unregisteredComponent": "Component is not registered: {{component}}"
  },
  "search": {
    "placeholder": "Search, or use prefixes like g / gh / npm",
    "submit": "Search"
  },
  "qrcode": {
    "protocol": "QR type",
    "open": "Open QR code",
    "displayMode": "Display mode",
    "editMode": "Edit mode",
    "edit": "Edit",
    "save": "Save",
    "cancelEdit": "Cancel",
    "history": "History",
    "deleteHistory": "Delete history",
    "currentContent": "Current content",
    "unsaved": "Not saved yet, editing is open by default",
    "savedAt": "Saved {{time}}",
    "copy": "Copy content",
    "tooLong": "Content is too long to generate a QR code",
    "unavailable": "Enter content to generate a QR code",
    "protocols": {
      "text": "Text",
      "url": "URL",
      "wifi": "Wi-Fi",
      "email": "Email",
      "phone": "Phone",
      "sms": "SMS",
      "vcard": "Contact",
      "geo": "Location",
      "event": "Event"
    },
    "fields": {
      "displayName": "Component name",
      "text": "Text",
      "url": "URL",
      "ssid": "Network name",
      "password": "Password",
      "encryption": "Encryption",
      "hidden": "Hidden network",
      "none": "No password",
      "yes": "Yes",
      "no": "No",
      "email": "Email address",
      "subject": "Subject",
      "body": "Body",
      "phone": "Phone number",
      "message": "Message",
      "name": "Name",
      "latitude": "Latitude",
      "longitude": "Longitude",
      "eventTitle": "Event title",
      "location": "Location",
      "startTime": "Start time",
      "endTime": "End time"
    }
  },
  "code": {
    "open": "Open code snippets",
    "add": "Add",
    "copy": "Copy",
    "format": "Format",
    "delete": "Delete",
    "done": "Done",
    "empty": "No code snippets yet",
    "untitled": "Untitled snippet",
    "snippetCount": "{{count}} snippets",
    "formatUnsupported": "Formatting is not supported for this language",
    "formatFailed": "Formatting failed. Check the code syntax",
    "fields": {
      "displayName": "Component name",
      "title": "Title",
      "language": "Language",
      "code": "Code"
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
      "text": "Text"
    }
  },
  "link": {
    "open": "Open links",
    "add": "Add",
    "copy": "Copy",
    "visit": "Visit",
    "delete": "Delete",
    "done": "Done",
    "pin": "Pin",
    "unpin": "Unpin",
    "search": "Search links",
    "empty": "No links yet",
    "untitled": "Untitled link",
    "linkCount": "{{count}} links",
    "fields": {
      "displayName": "Component name",
      "title": "Title",
      "url": "URL",
      "iconUrl": "Image URL (blank uses favicon)",
      "description": "Description",
      "tags": "Tags, separated by commas"
    }
  },
  "commandPalette": {
    "title": "Command palette",
    "placeholder": "Search or run a command, e.g. g React, gh vite, npm arco",
    "empty": "No matching commands",
    "commands": {
      "home": "Open home",
      "layoutEdit": "Edit layout",
      "settings": "Open settings",
      "about": "About"
    },
    "descriptions": {
      "home": "Return to the new tab home",
      "layoutEdit": "Open the layout editor",
      "settings": "Manage extension settings",
      "about": "View project information",
      "defaultSearch": "Search with {{engine}}",
      "prefixedSearch": "Search with {{engine}} using {{prefix}}",
      "engineHint": "Type {{prefix}} keywords to use this search engine"
    },
    "engines": {
      "google": "Google",
      "baidu": "Baidu",
      "bing": "Bing",
      "duckduckgo": "DuckDuckGo",
      "github": "GitHub",
      "npm": "npm",
      "mdn": "MDN"
    },
    "footer": {
      "navigate": "↑↓ Navigate",
      "confirm": "Enter Run"
    }
  },
  "apps": {
    "name": "Your's Tools",
    "home": "Home",
    "mail": "Mail",
    "calendar": "Calendar",
    "documents": "Documents",
    "team": "Team",
    "photos": "Photos",
    "music": "Music",
    "videos": "Videos",
    "files": "Files",
    "settings": "Settings",
    "tools": "Tools",
    "customize": "Customize",
    "help": "Help",
    "about": "About"
  },
  "drawer": {
    "title": "Menu",
    "section1": "Quick Actions",
    "content1": "Access frequently used tools and shortcuts from here.",
    "section2": "Recent Items",
    "content2": "View your recently accessed files and documents.",
    "section3": "Help & Support",
    "content3": "Get help and learn more about available features."
  }
} as const;
