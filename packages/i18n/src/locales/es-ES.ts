import enUS from './en-US';

export default {
  ...enUS,
  "title": "Dock estilo macOS",
  "subtitle": "Pasa el cursor sobre los iconos del Dock para ver el efecto de ampliación",
  "common": {
    "loading": "Cargando",
    "ok": "Aceptar",
    "cancel": "Cancelar",
    "close": "Cerrar",
    "success": "Correcto"
  },
  "settings": {
    ...enUS.settings,
    "title": "Configuración",
    "autoHide": "Ocultar automáticamente",
    "autoHideDesc": "Ocultar el Dock automáticamente cuando el cursor se aleja",
    "triggerDistance": "Distancia de activación",
    "triggerDistanceDesc": "Mostrar el Dock cuando el cursor esté a esta distancia del borde inferior",
    "pixels": "píxeles",
    "resetToDefault": "Restaurar valores",
    "resetConfirm": "¿Restaurar la configuración predeterminada?",
    "language": "Idioma",
    "languageDesc": "Selecciona el idioma de la interfaz",
    "dockSection": "Configuración del Dock",
    "generalSection": "Configuración general",
    "commandPaletteSection": "Paleta de comandos",
    "searchOpenTarget": "Dónde abrir resultados",
    "searchOpenTargetDesc": "Elige dónde se abren los resultados de la paleta de comandos y la búsqueda inicial",
    "searchOpenTargets": {
      "newWindow": "Nueva ventana",
      "newTab": "Nueva pestaña",
      "currentTab": "Pestaña actual"
    },
    "reset": {
      "success": "La configuración se restauró"
    },
    "resetSuccessTitle": "Aviso",
    "resetSuccessContent": "La configuración se restauró"
  },
  "components": {
    ...enUS.components,
    "components": "Componentes",
    "sidebar": {
      "title": "Panel de componentes",
      "searchPlaceholder": "Buscar componentes..."
    },
    "groups": {
      "layout": "Diseño",
      "container": "Contenedores",
      "feature": "Funciones"
    },
    "items": {
      "baseLayout": "Diseño",
      "baseSection": "Sección",
      "baseSwiper": "Carrusel",
      "baseNavbar": "Barra de navegación",
      "baseSearchBar": "Cuadro de búsqueda",
      "basePopular": "Popular",
      "baseFavorite": "Favoritos",
      "baseAt": "Correo",
      "baseCode": "Fragmento de código",
      "baseQrcode": "Código QR",
      "baseLink": "Enlace"
    },
    "operator": {
      "openComponents": "Abrir panel de componentes",
      "cancelEdit": "Cancelar edición",
      "saveEdit": "Guardar edición",
      "keepEditing": "Seguir editando",
      "cancelConfirm": "¿Cancelar la edición?",
      "saveConfirm": "¿Guardar los cambios?"
    }
  },
  "layout": {
    "editor": "Editor de diseño",
    "loadingComponent": "Cargando {{component}}...",
    "missingConfig": "Falta la configuración del componente",
    "unregisteredComponent": "Componente no registrado: {{component}}"
  },
  "search": {
    "placeholder": "Busca o usa prefijos como g / gh / npm",
    "submit": "Buscar"
  },
  "commandPalette": {
    ...enUS.commandPalette,
    "title": "Paleta de comandos",
    "placeholder": "Busca o ejecuta un comando, p. ej. g React, gh vite, npm arco",
    "empty": "No hay comandos coincidentes",
    "commands": {
      "home": "Abrir inicio",
      "layoutEdit": "Editar diseño",
      "settings": "Abrir configuración",
      "about": "Acerca de"
    },
    "descriptions": {
      "home": "Volver al inicio de la nueva pestaña",
      "layoutEdit": "Abrir el editor de diseño",
      "settings": "Gestionar la configuración de la extensión",
      "about": "Ver información del proyecto",
      "defaultSearch": "Buscar con {{engine}}",
      "prefixedSearch": "Buscar con {{engine}} usando {{prefix}}",
      "engineHint": "Escribe {{prefix}} palabras clave para usar este buscador"
    },
    "footer": {
      "navigate": "↑↓ Seleccionar",
      "confirm": "Enter Ejecutar"
    }
  },
  "drawer": {
    "title": "Menú",
    "section1": "Acciones rápidas",
    "content1": "Accede desde aquí a herramientas y accesos directos frecuentes.",
    "section2": "Elementos recientes",
    "content2": "Consulta archivos y documentos abiertos recientemente.",
    "section3": "Ayuda y soporte",
    "content3": "Obtén ayuda y descubre más funciones disponibles."
  }
} as const;
