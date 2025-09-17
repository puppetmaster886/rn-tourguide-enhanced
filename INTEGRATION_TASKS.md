# 🎯 Lista de Tareas: Integración react-native-leader-line

## Objetivo

Integrar la librería `react-native-leader-line` para mostrar flechas que conecten el modal del tooltip con los elementos destacados en el tour guide.

## 📋 Tareas Incrementales

### **✅ COMPLETADO** | **⏳ EN PROGRESO** | **❌ PENDIENTE**

---

### **Fase 1: Preparación y Setup**

#### Tarea 1.1: Instalar dependencias ✅

- [x] Instalar `react-native-leader-line`
- [x] Verificar que `react-native-svg` esté instalado (dependencia de leader-line)
- [x] Ejecutar `npm install` o `yarn install`
- [x] Verificar que no haya conflictos de dependencias
- [x] Correr tests existentes: `npm test`
- [x] Verificar compilación TypeScript: `npx tsc --noEmit`
- [ ] **VERIFICACIÓN**: Actualizar demo y confirmar que todo sigue funcionando

**Criterio de éxito**: ✅ Dependencias instaladas sin errores, tests pasan, TypeScript compila, demo funcional.

---

#### Tarea 1.2: Extender tipos ✅

- [x] Revisar tipos existientes en `src/types.ts`
- [x] Agregar interface `LeaderLineConfig` con opciones básicas:
  - `enabled: boolean` (default: true)
  - `color: string` (default: '#ffffff')
  - `size: number` (default: 2)
  - `startPlug: string` (default: 'disc')
  - `endPlug: string` (default: 'arrow1')
- [x] Extender `TourGuideProps` para incluir `leaderLineConfig?: LeaderLineConfig`
- [x] Extender `TooltipProps` para pasar configuración de flecha
- [x] Verificar compilación: `npx tsc --noEmit`
- [x] **VERIFICACIÓN**: Actualizar demo y confirmar que todo sigue funcionando

**Criterio de éxito**: ✅ Tipos definidos correctamente, TypeScript compila sin errores, demo funcional.

---

### **Fase 2: Integración Básica**

#### Tarea 2.1: Modificar Modal.tsx ✅

- [x] Importar `LeaderLine` de `react-native-leader-line`
- [x] Agregar refs para capturar elementos:
  - `tooltipRef` para el contenedor del tooltip
  - `highlightedElementRef` (se pasará desde TourGuideProvider)
- [x] Crear estado para manejar la instancia de LeaderLine
- [x] Implementar función `createLeaderLine()` que:
  - Conecte el modal con el elemento destacado
  - Use configuración básica por defecto
- [x] Llamar `createLeaderLine()` cuando el modal se muestre
- [x] Limpiar LeaderLine cuando el modal se oculte
- [x] Correr tests: `npm test`
- [x] Verificar TypeScript: `npx tsc --noEmit`
- [x] **VERIFICACIÓN**: Actualizar demo y confirmar que todo sigue funcionando

**Criterio de éxito**: ✅ Implementación básica completa, sin errores de TypeScript, tests pasan, demo funcional.

---

#### Tarea 2.2: Actualizar TourGuideProvider ✅

- [x] Agregar prop `leaderLineConfig` al TourGuideProvider
- [x] Pasar configuración al Modal a través del contexto
- [x] Obtener ref del elemento actual destacado (TourGuideZone)
- [x] Pasar ref del elemento destacado al Modal
- [x] Actualizar `App.tsx` con ejemplo básico de configuración
- [x] Correr tests: `npm test`
- [x] Verificar TypeScript: `npx tsc --noEmit`
- [x] **VERIFICACIÓN**: Ejecutar demo y verificar que la flecha se muestre correctamente

**Criterio de éxito**: ✅ Configuración se pasa correctamente, sistema de refs implementado, demo actualizado con configuración básica.

---

### **Fase 3: Configuración Avanzada**

#### Tarea 3.1: Extender IStep ✅

- [x] Agregar `leaderLineConfig?: LeaderLineConfig` a IStep
- [x] Propagar configuración desde TourGuideZone → Step → ConnectedStep
- [x] Implementar prioridad: step-level > provider-level > defaults
- [x] Correr tests: `npm test`
- [x] Verificar TypeScript: `npx tsc --noEmit`
- [x] **VERIFICACIÓN**: Actualizar demo y confirmar que configuración por step funciona

**Criterio de éxito**: ✅ Configuración específica por step funciona correctamente, propagación completa implementada, demo actualizado con ejemplos variados.

---

#### Tarea 3.2: Customización avanzada de flecha ❌

- [ ] Extender `LeaderLineConfig` con opciones avanzadas:
  - `path: 'straight' | 'arc' | 'fluid' | 'magnet'`
  - `startSocket: string` (auto, top, bottom, left, right)
  - `endSocket: string`
  - `dash: boolean | DashOptions`
  - `gradient: boolean | GradientOptions`
- [ ] Implementar lógica para aplicar configuraciones avanzadas
- [ ] Agregar ejemplos en `App.tsx` con diferentes estilos
- [ ] Testear todas las combinaciones de configuración
- [ ] Correr tests: `npm test`
- [ ] Verificar TypeScript: `npx tsc --noEmit`
- [ ] **VERIFICACIÓN**: Ejecutar demo con ejemplos variados y confirmar funcionalidad

**Criterio de éxito**: ❌ Todas las opciones de customización funcionan correctamente, demo funcional.

---

### **Fase 4: Testing y Refinamiento**

#### Tarea 4.1: Testing exhaustivo ❌

- [ ] Crear casos de test para LeaderLine en `components/`
- [ ] Testear diferentes configuraciones de flecha
- [ ] Testear comportamiento con elementos en diferentes posiciones
- [ ] Testear cleanup correcto de instancias LeaderLine
- [ ] Verificar performance con múltiples elementos
- [ ] Ejecutar demo completo con tour de múltiples pasos
- [ ] Correr todos los tests: `npm test`
- [ ] Verificar TypeScript: `npx tsc --noEmit`
- [ ] **VERIFICACIÓN**: Confirmar que todos los tests pasan y demo funciona perfectamente

**Criterio de éxito**: ❌ Todos los tests pasan, performance aceptable, demo completamente funcional.

---

#### Tarea 4.2: Documentación y ejemplos ❌

- [ ] Actualizar `README.md` con:
  - Sección sobre flechas LeaderLine
  - Ejemplos de configuración
  - Props disponibles
- [ ] Agregar ejemplos completos en `App.tsx`
- [ ] Documentar limitaciones conocidas
- [ ] Agregar screenshots de ejemplos
- [ ] Verificar que toda la documentación esté actualizada
- [ ] **VERIFICACIÓN**: Confirmar que documentación coincide con funcionalidad del demo

**Criterio de éxito**: ❌ Documentación completa y ejemplos funcionales verificados en demo.

---

## 🎯 Estado Actual: **TAREA 3.2 PENDIENTE** ❌

**Próxima acción**: Completar Tarea 3.2

## 📝 Protocolo de Verificación

**⚠️ IMPORTANTE**: Después de cada tarea completada:

1. **Actualizar el demo** en `App.tsx` si es necesario
2. **Ejecutar el servidor**: `export NODE_OPTIONS="--openssl-legacy-provider" && yarn start`
3. **Esperar confirmación del usuario** antes de continuar con la siguiente tarea
4. **Verificar que todo sigue funcionando** igual o mejor que antes

## 🔄 Proceso de Trabajo

1. ✅ Completar una tarea
2. 🔄 Actualizar demo si es necesario
3. ⏸️ **PARAR** y esperar verificación del usuario
4. ✅ Solo continuar cuando el usuario confirme que todo funciona
5. 🔄 Repetir proceso para la siguiente tarea
