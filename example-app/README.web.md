# Tour Guide Enhanced - Web Demo

Este es el demo web de la librería **rn-tourguide-enhanced** desplegado en GitHub Pages.

## 🌐 Demo en Vivo

Visita la demo en: [https://puppetmaster886.github.io/rn-tourguide-enhanced/](https://puppetmaster886.github.io/rn-tourguide-enhanced/)

## 🚀 Características

- ✨ Tour interactivo con tooltips personalizados
- 🎯 Leader lines suaves que conectan elementos
- 📱 Diseño responsive
- 🎨 Interfaz moderna y atractiva
- ⚡ Optimizado para web usando React Native Web

## 🔧 Desarrollo Local

Para ejecutar el demo localmente:

```bash
# Instalar dependencias
cd example-app
npm install

# Ejecutar en modo desarrollo
npm run web

# Construir para producción
npm run build:web

# Servir build de producción
npm run serve
```

## 📦 Estructura del Proyecto Web

```
example-app/
├── App.web.tsx          # Versión web de la aplicación
├── index.web.js         # Punto de entrada para web
├── index.html           # Template HTML
├── webpack.config.js    # Configuración de Webpack
├── babel.config.web.js  # Configuración Babel para web
└── dist/               # Build de producción
```

## 🛠️ Tecnologías Utilizadas

- **React Native Web** - Para compatibilidad web
- **Webpack** - Bundling y optimización
- **Babel** - Transpilación de código
- **GitHub Actions** - CI/CD automatizado
- **GitHub Pages** - Hosting del demo

## 🔄 Despliegue Automático

Cada push a la rama `main` activa automáticamente:

1. Build del proyecto web
2. Optimización de assets
3. Despliegue a GitHub Pages

El workflow se encuentra en `.github/workflows/deploy.yml`

## 📝 Notas de Compatibilidad

- El demo usa `react-native-svg-web` para compatibilidad SVG
- Los iconos de Material Icons están incluidos
- Algunas funcionalidades específicas de mobile pueden tener comportamiento diferente en web

## 🐛 Problemas Conocidos

- Los warnings sobre el tamaño del bundle son normales para este demo
- Algunas animaciones pueden variar entre web y mobile
- Los leader lines funcionan mejor en navegadores modernos

## 📄 Licencia

Este proyecto está bajo la licencia MIT. Ver [LICENSE](../LICENSE) para más detalles.