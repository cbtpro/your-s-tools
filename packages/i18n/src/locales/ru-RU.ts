import enUS from './en-US';

export default {
  ...enUS,
  "title": "Dock в стиле macOS",
  "subtitle": "Наведите курсор на значки Dock, чтобы увидеть эффект увеличения",
  "common": {
    "loading": "Загрузка",
    "ok": "ОК",
    "cancel": "Отмена",
    "close": "Закрыть",
    "success": "Успешно"
  },
  "settings": {
    ...enUS.settings,
    "title": "Настройки",
    "autoHide": "Автоскрытие",
    "autoHideDesc": "Автоматически скрывать Dock, когда курсор уходит",
    "triggerDistance": "Расстояние срабатывания",
    "triggerDistanceDesc": "Показывать Dock, когда курсор находится на этом расстоянии от нижнего края",
    "pixels": "пикс.",
    "resetToDefault": "Сбросить",
    "resetConfirm": "Сбросить настройки по умолчанию?",
    "language": "Язык",
    "languageDesc": "Выберите язык интерфейса",
    "dockSection": "Настройки Dock",
    "generalSection": "Общие настройки",
    "commandPaletteSection": "Палитра команд",
    "searchOpenTarget": "Где открывать результаты",
    "searchOpenTargetDesc": "Выберите, где открывать результаты из палитры команд и поиска на главной",
    "searchOpenTargets": {
      "newWindow": "Новое окно",
      "newTab": "Новая вкладка",
      "currentTab": "Текущая вкладка"
    },
    "reset": {
      "success": "Настройки сброшены"
    },
    "resetSuccessTitle": "Уведомление",
    "resetSuccessContent": "Настройки сброшены"
  },
  "components": {
    ...enUS.components,
    "components": "Компоненты",
    "sidebar": {
      "title": "Панель компонентов",
      "searchPlaceholder": "Поиск компонентов..."
    },
    "groups": {
      "layout": "Макет",
      "container": "Контейнеры",
      "feature": "Функции"
    },
    "items": {
      "baseLayout": "Макет",
      "baseSection": "Раздел",
      "baseSwiper": "Карусель",
      "baseNavbar": "Навигационная панель",
      "baseSearchBar": "Строка поиска",
      "basePopular": "Популярное",
      "baseFavorite": "Избранное",
      "baseAt": "Почта",
      "baseCode": "Фрагмент кода",
      "baseQrcode": "QR-код",
      "baseLink": "Ссылка"
    },
    "operator": {
      "openComponents": "Открыть панель компонентов",
      "cancelEdit": "Отменить редактирование",
      "saveEdit": "Сохранить изменения",
      "keepEditing": "Продолжить редактирование",
      "cancelConfirm": "Отменить редактирование?",
      "saveConfirm": "Сохранить изменения?"
    }
  },
  "layout": {
    "editor": "Редактор макета",
    "loadingComponent": "Загрузка {{component}}...",
    "missingConfig": "Отсутствует конфигурация компонента",
    "unregisteredComponent": "Компонент не зарегистрирован: {{component}}"
  },
  "search": {
    "placeholder": "Поиск или префиксы вроде g / gh / npm",
    "submit": "Поиск"
  },
  "commandPalette": {
    ...enUS.commandPalette,
    "title": "Палитра команд",
    "placeholder": "Поиск или команда, например: g React, gh vite, npm arco",
    "empty": "Нет подходящих команд",
    "commands": {
      "home": "Открыть главную",
      "layoutEdit": "Редактировать макет",
      "settings": "Открыть настройки",
      "about": "О проекте"
    },
    "descriptions": {
      "home": "Вернуться на главную страницу новой вкладки",
      "layoutEdit": "Открыть редактор макета",
      "settings": "Управлять настройками расширения",
      "about": "Посмотреть информацию о проекте",
      "defaultSearch": "Искать через {{engine}}",
      "prefixedSearch": "Искать через {{engine}} с префиксом {{prefix}}",
      "engineHint": "Введите {{prefix}} и запрос, чтобы использовать эту поисковую систему"
    },
    "footer": {
      "navigate": "↑↓ Выбрать",
      "confirm": "Enter Выполнить"
    }
  },
  "drawer": {
    "title": "Меню",
    "section1": "Быстрые действия",
    "content1": "Здесь доступны часто используемые инструменты и ярлыки.",
    "section2": "Недавние элементы",
    "content2": "Просматривайте недавно открытые файлы и документы.",
    "section3": "Помощь и поддержка",
    "content3": "Получите помощь и узнайте больше о доступных функциях."
  }
} as const;
