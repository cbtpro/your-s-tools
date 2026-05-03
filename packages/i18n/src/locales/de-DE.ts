import enUS from './en-US';

export default {
  ...enUS,
  "title": "macOS-Dock-Stil",
  "subtitle": "Bewege den Mauszeiger über Dock-Symbole, um die Vergrößerung zu sehen",
  "common": {
    "loading": "Lädt",
    "ok": "OK",
    "cancel": "Abbrechen",
    "close": "Schließen",
    "success": "Erfolg"
  },
  "settings": {
    ...enUS.settings,
    "title": "Einstellungen",
    "autoHide": "Automatisch ausblenden",
    "autoHideDesc": "Dock automatisch ausblenden, wenn die Maus entfernt ist",
    "triggerDistance": "Auslösedistanz",
    "triggerDistanceDesc": "Dock anzeigen, wenn die Maus diesen Abstand zum unteren Rand erreicht",
    "pixels": "Pixel",
    "resetToDefault": "Zurücksetzen",
    "resetConfirm": "Auf Standardeinstellungen zurücksetzen?",
    "language": "Sprache",
    "languageDesc": "Oberflächensprache auswählen",
    "dockSection": "Dock-Einstellungen",
    "generalSection": "Allgemeine Einstellungen",
    "commandPaletteSection": "Befehlspalette",
    "searchOpenTarget": "Suchergebnisse öffnen",
    "searchOpenTargetDesc": "Lege fest, wo Suchergebnisse aus Befehlspalette und Startseite geöffnet werden",
    "searchOpenTargets": {
      "newWindow": "Neues Fenster",
      "newTab": "Neuer Tab",
      "currentTab": "Aktueller Tab"
    },
    "reset": {
      "success": "Einstellungen wurden zurückgesetzt"
    },
    "resetSuccessTitle": "Hinweis",
    "resetSuccessContent": "Einstellungen wurden zurückgesetzt"
  },
  "components": {
    ...enUS.components,
    "components": "Komponenten",
    "sidebar": {
      "title": "Komponentenpanel",
      "searchPlaceholder": "Komponenten suchen..."
    },
    "groups": {
      "layout": "Layout",
      "container": "Container",
      "feature": "Funktionen"
    },
    "items": {
      "baseLayout": "Layout",
      "baseSection": "Abschnitt",
      "baseSwiper": "Karussell",
      "baseNavbar": "Navigationsleiste",
      "baseSearchBar": "Suchfeld",
      "basePopular": "Beliebt",
      "baseFavorite": "Favoriten",
      "baseAt": "E-Mail",
      "baseCode": "Code-Snippet",
      "baseQrcode": "QR-Code",
      "baseLink": "Link"
    },
    "operator": {
      "openComponents": "Komponentenpanel öffnen",
      "cancelEdit": "Bearbeitung abbrechen",
      "saveEdit": "Bearbeitung speichern",
      "keepEditing": "Weiter bearbeiten",
      "cancelConfirm": "Bearbeitung wirklich abbrechen?",
      "saveConfirm": "Änderungen wirklich speichern?"
    }
  },
  "layout": {
    "editor": "Layout-Editor",
    "loadingComponent": "{{component}} wird geladen...",
    "missingConfig": "Komponentenkonfiguration fehlt",
    "unregisteredComponent": "Komponente ist nicht registriert: {{component}}"
  },
  "search": {
    "placeholder": "Suchen oder Präfixe wie g / gh / npm verwenden",
    "submit": "Suchen"
  },
  "commandPalette": {
    ...enUS.commandPalette,
    "title": "Befehlspalette",
    "placeholder": "Suchen oder Befehl ausführen, z. B. g React, gh vite, npm arco",
    "empty": "Keine passenden Befehle",
    "commands": {
      "home": "Startseite öffnen",
      "layoutEdit": "Layout bearbeiten",
      "settings": "Einstellungen öffnen",
      "about": "Über"
    },
    "descriptions": {
      "home": "Zur Startseite des neuen Tabs zurückkehren",
      "layoutEdit": "Layout-Editor öffnen",
      "settings": "Erweiterungseinstellungen verwalten",
      "about": "Projektinformationen anzeigen",
      "defaultSearch": "Mit {{engine}} suchen",
      "prefixedSearch": "Mit {{engine}} über {{prefix}} suchen",
      "engineHint": "{{prefix}} Suchbegriff eingeben, um diese Suchmaschine zu verwenden"
    },
    "footer": {
      "navigate": "↑↓ Auswählen",
      "confirm": "Enter Ausführen"
    }
  },
  "drawer": {
    "title": "Menü",
    "section1": "Schnellaktionen",
    "content1": "Greife hier auf häufig genutzte Tools und Verknüpfungen zu.",
    "section2": "Letzte Elemente",
    "content2": "Zeige zuletzt geöffnete Dateien und Dokumente an.",
    "section3": "Hilfe und Support",
    "content3": "Erhalte Hilfe und erfahre mehr über verfügbare Funktionen."
  }
} as const;
