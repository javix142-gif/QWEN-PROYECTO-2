# 🛡️ Valheim 2D - Juego de Supervivencia Vikingo

Un juego de supervivencia en 2D inspirado en Valheim, con generación procedural de mundo, múltiples biomas, sistema de construcción y exploración.

## 🎮 Características

### Mundo Procedural
- **Generación basada en ruido Perlin**: Terreno único cada vez que juegas
- **5 Biomas diferentes**:
  - 🌿 **Pradera**: Punto de inicio seguro con recursos básicos
  - 🌲 **Bosque Negro**: Bosques densos con hierro y enemigos peligrosos
  - 🏞️ **Pantano**: Zona húmeda con hierro y no-muertos
  - ⛰️ **Montaña**: Picos nevados con plata y criaturas feroces
  - 🏜️ **Llanura**: Zonas áridas con recursos avanzados

### Sistema de Biomas Coherente
Los biomas se distribuyen lógicamente según:
- **Elevación**: Las montañas están en zonas altas, los pantanos en bajas
- **Humedad**: Los bosques necesitan humedad, las llanuras son secas
- **Temperatura**: Varía con la latitud y elevación

### Jugabilidad
- ⚔️ **Combate**: Ataca árboles, rocas y enemigos
- 🔨 **Construcción**: Coloca bloques para construir bases
- 🎒 **Inventario**: Sistema de slots con recolección de recursos
- 💪 **Stats**: Vida, estamina y hambre
- 🌅 **Ciclo Día/Noche**: Amanecer, día, atardecer y noche
- 🗺️ **Minimapa**: Explora y descubre el mundo

### Assets Procedurales
- Árboles con troncos y copas detalladas
- Rocas con textura irregular
- Arbustos con bayas recolectables
- Bloques con patrones únicos
- Efectos de partículas al minar

## 🕹️ Controles

| Tecla | Acción |
|-------|--------|
| **W / A / S / D** | Moverse y saltar |
| **Flechas** | Alternativa de movimiento |
| **Click Izquierdo** | Atacar / Minar |
| **Click Derecho** | Colocar bloque (modo construcción) |
| **1-5** | Seleccionar slot del inventario |
| **B** | Activar/Desactivar modo construcción |
| **M** | Mostrar/Ocultar minimapa |
| **E** | Interactuar |

## 🚀 Cómo Jugar

1. Abre el archivo `index.html` en tu navegador web moderno (Chrome, Firefox, Edge)
2. El juego cargará automáticamente con un mundo generado proceduralmente
3. Explora el mundo, recolecta recursos y sobrevive

## 📁 Archivos

- `index.html`: Estructura HTML y estilos CSS
- `game.js`: Lógica completa del juego

## 🛠️ Tecnologías

- **HTML5 Canvas**: Renderizado gráfico
- **JavaScript Vanilla**: Sin dependencias externas
- **Ruido Perlin**: Generación procedural de terreno
- **Sistema de Chunks**: Carga eficiente del mundo

## 🎯 Objetivos del Juego

1. **Exploración**: Descubre todos los biomas
2. **Supervivencia**: Mantén tus stats (vida, estamina, hambre)
3. **Recolección**: Consigue recursos de diferentes biomas
4. **Construcción**: Edifica tu base vikinga
5. **Progresión**: Equípate mejor para explorar zonas peligrosas

## 🌟 Características Técnicas

### Generación de Mundo
- Seed aleatorio para cada partida
- Transiciones suaves entre biomas
- Distribución lógica de recursos
- Objetos colocados coherentemente (árboles en superficie, minerales en profundidad)

### Rendimiento
- Solo se renderiza lo visible en pantalla
- Sistema de chunks para carga diferida
- Optimizado para 60 FPS

### Sistema de Física
- Gravedad y velocidad terminal
- Detección de colisiones tile-based
- Movimiento suave con interpolación

## 💡 Consejos

- Empieza en la **Pradera** para familiarizarte
- Los **árboles** dan madera, las **rocas** dan piedra
- La **estamina** se regenera cuando estás en el suelo
- El **hambre** disminuye gradualmente, come bayas para recuperarla
- Explora hacia los **lados** para encontrar nuevos biomas
- Usa el **minimapa** para orientarte

## 🔮 Futuras Mejoras (Roadmap)

- [ ] Sistema de crafting completo
- [ ] Enemigos con IA
- [ ] Más tipos de construcción
- [ ] Sistema de guardado/carga
- [ ] Sonido y música
- [ ] Jefes de bioma
- [ ] Modo multijugador local

---

**¡Que los dioses nórdicos guíen tu aventura! ⚡🪓**
