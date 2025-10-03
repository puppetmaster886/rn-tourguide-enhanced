#!/bin/bash

# Script para development con logging mejorado
# Uso: ./dev-with-logs.sh

echo "🚀 Iniciando desarrollo con logging mejorado..."

# Función para cleanup cuando se termina el script
cleanup() {
    echo "🛑 Terminando procesos..."
    kill $METRO_PID 2>/dev/null
    kill $LOGCAT_PID 2>/dev/null
    exit
}

# Capturar Ctrl+C
trap cleanup INT

# Limpiar cache de Metro
echo "🧹 Limpiando cache de Metro..."
cd "$(dirname "$0")"
yarn start --reset-cache --port 8087 &
METRO_PID=$!

# Esperar a que Metro esté listo
sleep 5

# Iniciar logcat en background para capturar logs de Android
echo "📱 Iniciando logcat para Android..."
adb logcat -s "ReactNativeJS:*" "ReactNative:*" "chromium:*" "*:E" "*:W" &
LOGCAT_PID=$!

echo "✅ Setup completo!"
echo "📱 Metro corriendo en puerto 8087"
echo "📝 Logs de Android siendo capturados"
echo ""
echo "Para correr la app:"
echo "  npx react-native run-android --port=8087"
echo ""
echo "Presiona Ctrl+C para terminar todo"

# Mantener el script corriendo
wait $METRO_PID
