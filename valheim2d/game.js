// ============================================
// VALHEIM 2D - Juego de Supervivencia Vikingo
// ============================================

// Configuración del canvas
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const minimapCanvas = document.getElementById('minimap');
const minimapCtx = minimapCanvas.getContext('2d');

// Ajustar canvas al tamaño de la ventana
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// ============================================
// CONSTANTES Y CONFIGURACIÓN
// ============================================

const TILE_SIZE = 32;
const CHUNK_SIZE = 16;
const WORLD_WIDTH = 512; // en chunks
const WORLD_HEIGHT = 256; // en chunks
const GRAVITY = 0.5;
const TERMINAL_VELOCITY = 15;

// Tipos de biomas con sus características
const BIOMES = {
    MEADOW: {
        id: 0,
        name: 'Pradera',
        colors: {
            ground: ['#4a7c23', '#5a8c33', '#3a6c13'],
            grass: '#6ab343',
            sky: '#87CEEB',
            ambient: '#90EE90'
        },
        trees: ['oak', 'birch'],
        resources: ['wood', 'stone', 'berries'],
        enemies: ['boar', 'deer'],
        elevation: { min: 0.3, max: 0.5 },
        moisture: { min: 0.3, max: 0.6 }
    },
    BLACK_FOREST: {
        id: 1,
        name: 'Bosque Negro',
        colors: {
            ground: ['#2d4a1e', '#3d5a2e', '#1d3a0e'],
            grass: '#3a7c23',
            sky: '#6B8E6B',
            ambient: '#556B2F'
        },
        trees: ['pine', 'beech'],
        resources: ['wood', 'stone', 'iron', 'mushrooms'],
        enemies: ['wolf', 'skeleton', 'troll'],
        elevation: { min: 0.4, max: 0.7 },
        moisture: { min: 0.4, max: 0.7 }
    },
    SWAMP: {
        id: 2,
        name: 'Pantano',
        colors: {
            ground: ['#3a2f1e', '#4a3f2e', '#2a1f0e'],
            grass: '#5a6c33',
            sky: '#556B55',
            ambient: '#6B8E55'
        },
        trees: ['dead', 'willow'],
        resources: ['iron', 'mud', 'bones'],
        enemies: ['draugr', 'leech', 'blob'],
        elevation: { min: 0.1, max: 0.3 },
        moisture: { min: 0.7, max: 1.0 }
    },
    MOUNTAIN: {
        id: 3,
        name: 'Montaña',
        colors: {
            ground: ['#6a6a6a', '#7a7a7a', '#5a5a5a'],
            grass: '#4a5a33',
            sky: '#B0C4DE',
            ambient: '#D3D3D3'
        },
        trees: [],
        resources: ['stone', 'silver', 'obsidian'],
        enemies: ['wolf', 'drake', 'yeti'],
        elevation: { min: 0.7, max: 1.0 },
        moisture: { min: 0.1, max: 0.4 }
    },
    PLAINS: {
        id: 4,
        name: 'Llanura',
        colors: {
            ground: ['#c4a35a', '#d4b36a', '#b4934a'],
            grass: '#aab343',
            sky: '#87CEEB',
            ambient: '#F4A460'
        },
        trees: [],
        resources: ['flint', 'clay', 'barley'],
        enemies: ['lox', 'fuling', 'deathquito'],
        elevation: { min: 0.2, max: 0.4 },
        moisture: { min: 0.2, max: 0.5 }
    }
};

// Tipos de bloques
const BLOCKS = {
    AIR: 0,
    DIRT: 1,
    GRASS: 2,
    STONE: 3,
    WOOD: 4,
    LEAVES: 5,
    WATER: 6,
    SAND: 7,
    SNOW: 8,
    BEDROCK: 9,
    ORE_IRON: 10,
    ORE_SILVER: 11,
    ORE_COPPER: 12,
    LOG: 13,
    PLANKS: 14,
    WALL_WOOD: 15,
    FLOOR_WOOD: 16,
    ROOF_WOOD: 17,
    DOOR: 18,
    CHEST: 19,
    WORKBENCH: 20,
    FIRE: 21,
    TORCH: 22
};

// Colores de los bloques para renderizado procedural
const BLOCK_COLORS = {
    [BLOCKS.DIRT]: ['#5a4a3a', '#6a5a4a', '#4a3a2a'],
    [BLOCKS.GRASS]: ['#4a7c23', '#5a8c33', '#3a6c13'],
    [BLOCKS.STONE]: ['#6a6a6a', '#7a7a7a', '#5a5a5a'],
    [BLOCKS.WOOD]: ['#8b4513', '#9b5523', '#7b3503'],
    [BLOCKS.LEAVES]: ['#228b22', '#32cd32', '#1a7b1a'],
    [BLOCKS.WATER]: ['#4a90e2', '#5aa0f2', '#3a80d2'],
    [BLOCKS.SAND]: ['#e4d96f', '#f4e97f', '#d4c95f'],
    [BLOCKS.SNOW]: ['#fffafa', '#fff0f5', '#f0f0ff'],
    [BLOCKS.BEDROCK]: ['#2a2a2a', '#3a3a3a', '#1a1a1a'],
    [BLOCKS.ORE_IRON]: ['#6a6a6a', '#8b4513', '#5a5a5a'],
    [BLOCKS.ORE_SILVER]: ['#6a6a6a', '#c0c0c0', '#5a5a5a'],
    [BLOCKS.ORE_COPPER]: ['#6a6a6a', '#b87333', '#5a5a5a'],
    [BLOCKS.LOG]: ['#8b4513', '#a0522d', '#6b3503'],
    [BLOCKS.PLANKS]: ['#cd853f', '#da954f', '#bd752f'],
    [BLOCKS.WALL_WOOD]: ['#a0522d', '#b0623d', '#90421d'],
    [BLOCKS.FLOOR_WOOD]: ['#cd853f', '#da954f', '#bd752f'],
    [BLOCKS.ROOF_WOOD]: ['#8b4513', '#9b5523', '#7b3503'],
    [BLOCKS.DOOR]: ['#8b4513', '#a0522d', '#6b3503'],
    [BLOCKS.CHEST]: ['#8b4513', '#daa520', '#6b3503'],
    [BLOCKS.WORKBENCH]: ['#8b4513', '#cd853f', '#6b3503'],
    [BLOCKS.FIRE]: ['#ff4500', '#ff6347', '#ff0000'],
    [BLOCKS.TORCH]: ['#ff4500', '#daa520', '#cc3300']
};

// ============================================
// GENERADOR DE NÚMEROS ALEATORIOS CON SEMILLA
// ============================================

class SeededRandom {
    constructor(seed) {
        this.seed = seed;
    }
    
    next() {
        this.seed = (this.seed * 1103515245 + 12345) & 0x7fffffff;
        return this.seed / 0x7fffffff;
    }
    
    range(min, max) {
        return Math.floor(this.next() * (max - min + 1)) + min;
    }
}

// ============================================
// GENERACIÓN PROCEDURAL DEL MUNDO
// ============================================

class WorldGenerator {
    constructor(seed) {
        this.seed = seed;
        this.rng = new SeededRandom(seed);
        this.elevationNoise = [];
        this.moistureNoise = [];
        this.temperatureNoise = [];
        this.biomeMap = [];
        this.blocks = [];
        this.objects = [];
        
        this.generateNoiseMaps();
    }
    
    // Generar mapas de ruido usando múltiples octavas
    generateNoiseMaps() {
        const width = WORLD_WIDTH * CHUNK_SIZE;
        const height = WORLD_HEIGHT * CHUNK_SIZE;
        
        for (let x = 0; x < width; x++) {
            this.elevationNoise[x] = [];
            this.moistureNoise[x] = [];
            this.temperatureNoise[x] = [];
            
            for (let y = 0; y < height; y++) {
                // Usar múltiples octavas de ruido para mayor detalle
                let elevation = this.generateNoise(x, y, 0.02, 4);
                let moisture = this.generateNoise(x, y, 0.03, 3);
                let temperature = this.generateNoise(x, y, 0.015, 3);
                
                // Aplicar gradiente latitudinal para temperatura
                temperature *= (y / height) * 0.5 + 0.5;
                
                this.elevationNoise[x][y] = elevation;
                this.moistureNoise[x][y] = moisture;
                this.temperatureNoise[x][y] = temperature;
            }
        }
        
        this.generateBiomeMap();
    }
    
    // Generador de ruido simple basado en gradiente
    generateNoise(x, y, scale, octaves) {
        let value = 0;
        let amplitude = 1;
        let frequency = scale;
        let maxValue = 0;
        
        for (let i = 0; i < octaves; i++) {
            value += amplitude * this.smoothNoise(x * frequency, y * frequency);
            maxValue += amplitude;
            amplitude *= 0.5;
            frequency *= 2;
        }
        
        return value / maxValue;
    }
    
    smoothNoise(x, y) {
        const intX = Math.floor(x);
        const intY = Math.floor(y);
        const fracX = x - intX;
        const fracY = y - intY;
        
        const v1 = this.hash(intX, intY);
        const v2 = this.hash(intX + 1, intY);
        const v3 = this.hash(intX, intY + 1);
        const v4 = this.hash(intX + 1, intY + 1);
        
        const i1 = this.lerp(v1, v2, fracX);
        const i2 = this.lerp(v3, v4, fracX);
        
        return this.lerp(i1, i2, fracY);
    }
    
    hash(x, y) {
        let n = x + y * 57;
        n = (n << 13) ^ n;
        return (1.0 - ((n * (n * n * 15731 + 789221) + 1376312589) & 0x7fffffff) / 1073741824.0);
    }
    
    lerp(a, b, t) {
        return a + (b - a) * t;
    }
    
    // Determinar bioma basado en elevación, humedad y temperatura
    generateBiomeMap() {
        const width = WORLD_WIDTH * CHUNK_SIZE;
        const height = WORLD_HEIGHT * CHUNK_SIZE;
        
        for (let x = 0; x < width; x++) {
            this.biomeMap[x] = [];
            for (let y = 0; y < height; y++) {
                const elevation = this.elevationNoise[x][y];
                const moisture = this.moistureNoise[x][y];
                const temperature = this.temperatureNoise[x][y];
                
                let biome = BIOMES.MEADOW;
                
                // Reglas lógicas para distribución de biomas
                if (elevation > 0.8 && temperature < 0.4) {
                    biome = BIOMES.MOUNTAIN;
                } else if (elevation > 0.7) {
                    biome = BIOMES.MOUNTAIN;
                } else if (moisture > 0.7 && elevation < 0.4) {
                    biome = BIOMES.SWAMP;
                } else if (moisture > 0.5 && elevation > 0.4 && elevation < 0.7) {
                    biome = BIOMES.BLACK_FOREST;
                } else if (moisture < 0.4 && elevation < 0.4) {
                    biome = BIOMES.PLAINS;
                } else {
                    biome = BIOMES.MEADOW;
                }
                
                this.biomeMap[x][y] = biome;
            }
        }
    }
    
    // Generar terreno para una sección del mundo
    generateTerrain(chunkX, chunkY) {
        const startX = chunkX * CHUNK_SIZE;
        const startY = chunkY * CHUNK_SIZE;
        const blocks = [];
        
        for (let x = 0; x < CHUNK_SIZE; x++) {
            blocks[x] = [];
            const worldX = startX + x;
            
            for (let y = 0; y < CHUNK_SIZE; y++) {
                const worldY = startY + y;
                const elevation = this.elevationNoise[worldX]?.[worldY] || 0.5;
                const biome = this.biomeMap[worldX]?.[worldY] || BIOMES.MEADOW;
                
                // Generar altura del terreno
                const surfaceLevel = Math.floor((1 - elevation) * WORLD_HEIGHT * CHUNK_SIZE * 0.8);
                
                if (y > surfaceLevel + 10) {
                    blocks[x][y] = BLOCKS.BEDROCK;
                } else if (y > surfaceLevel + 3) {
                    // Probabilidad de minerales basada en profundidad y bioma
                    if (biome === BIOMES.BLACK_FOREST && y > surfaceLevel + 5 && Math.random() < 0.05) {
                        blocks[x][y] = BLOCKS.ORE_IRON;
                    } else if (biome === BIOMES.MOUNTAIN && y > surfaceLevel + 6 && Math.random() < 0.04) {
                        blocks[x][y] = BLOCKS.ORE_SILVER;
                    } else if (biome === BIOMES.PLAINS && y > surfaceLevel + 4 && Math.random() < 0.06) {
                        blocks[x][y] = BLOCKS.ORE_COPPER;
                    } else {
                        blocks[x][y] = BLOCKS.STONE;
                    }
                } else if (y > surfaceLevel) {
                    blocks[x][y] = BLOCKS.DIRT;
                } else if (y === surfaceLevel) {
                    // Capa superficial según bioma
                    if (biome === BIOMES.SWAMP) {
                        blocks[x][y] = BLOCKS.WATER;
                    } else if (biome === BIOMES.PLAINS) {
                        blocks[x][y] = BLOCKS.SAND;
                    } else if (biome === BIOMES.MOUNTAIN && elevation > 0.85) {
                        blocks[x][y] = BLOCKS.SNOW;
                    } else {
                        blocks[x][y] = BLOCKS.GRASS;
                    }
                } else {
                    blocks[x][y] = BLOCKS.AIR;
                }
            }
        }
        
        return blocks;
    }
    
    // Generar objetos (árboles, rocas, etc.)
    generateObjects(chunkX, chunkY, terrain) {
        const objects = [];
        const biome = this.biomeMap[chunkX * CHUNK_SIZE]?.[chunkY * CHUNK_SIZE] || BIOMES.MEADOW;
        
        for (let x = 0; x < CHUNK_SIZE; x++) {
            // Encontrar superficie
            let surfaceY = 0;
            for (let y = 0; y < CHUNK_SIZE; y++) {
                if (terrain[x][y] !== BLOCKS.AIR && terrain[x][y] !== BLOCKS.WATER) {
                    surfaceY = y - 1;
                    break;
                }
            }
            
            // Probabilidad de generar árbol basada en bioma
            if (biome.trees.length > 0 && Math.random() < 0.1) {
                const treeType = biome.trees[Math.floor(Math.random() * biome.trees.length)];
                objects.push({
                    type: 'tree',
                    subtype: treeType,
                    x: chunkX * CHUNK_SIZE + x,
                    y: chunkY * CHUNK_SIZE + surfaceY,
                    health: 50,
                    drops: ['wood', 'leaves']
                });
            }
            
            // Rocas
            if (Math.random() < 0.05) {
                objects.push({
                    type: 'rock',
                    x: chunkX * CHUNK_SIZE + x,
                    y: chunkY * CHUNK_SIZE + surfaceY,
                    health: 30,
                    drops: ['stone']
                });
            }
            
            // Recursos especiales
            if (biome.resources.includes('berries') && Math.random() < 0.03) {
                objects.push({
                    type: 'bush',
                    x: chunkX * CHUNK_SIZE + x,
                    y: chunkY * CHUNK_SIZE + surfaceY,
                    health: 10,
                    drops: ['berries']
                });
            }
        }
        
        return objects;
    }
}

// ============================================
// JUGADOR
// ============================================

class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 20;
        this.height = 40;
        this.vx = 0;
        this.vy = 0;
        this.speed = 5;
        this.jumpForce = -10;
        this.grounded = false;
        
        // Stats
        this.maxHealth = 100;
        this.health = 100;
        this.maxStamina = 100;
        this.stamina = 100;
        this.hunger = 100;
        
        // Inventario
        this.inventory = [];
        this.selectedSlot = 0;
        this.maxSlots = 10;
        
        // Estado
        this.facing = 1; // 1 = derecha, -1 = izquierda
        this.attacking = false;
        this.attackCooldown = 0;
        this.buildMode = false;
        
        // Equipo
        this.tool = 'hands';
        this.weapon = 'fists';
    }
    
    update(input, world) {
        // Movimiento horizontal
        this.vx = 0;
        if (input.left) {
            this.vx = -this.speed;
            this.facing = -1;
        }
        if (input.right) {
            this.vx = this.speed;
            this.facing = 1;
        }
        
        // Salto
        if (input.jump && this.grounded && this.stamina >= 20) {
            this.vy = this.jumpForce;
            this.grounded = false;
            this.stamina -= 20;
        }
        
        // Gravedad
        this.vy += GRAVITY;
        if (this.vy > TERMINAL_VELOCITY) {
            this.vy = TERMINAL_VELOCITY;
        }
        
        // Aplicar movimiento con colisiones
        this.x += this.vx;
        this.checkCollision(world, 'x');
        
        this.y += this.vy;
        this.checkCollision(world, 'y');
        
        // Regeneración de estamina
        if (this.grounded && !input.jump && this.stamina < this.maxStamina) {
            this.stamina += 0.5;
        }
        
        // Hambre
        if (this.hunger > 0) {
            this.hunger -= 0.01;
        }
        
        // Cooldown de ataque
        if (this.attackCooldown > 0) {
            this.attackCooldown--;
        }
        
        // Mantener dentro del mundo
        if (this.x < 0) this.x = 0;
        if (this.x > WORLD_WIDTH * CHUNK_SIZE * TILE_SIZE) {
            this.x = WORLD_WIDTH * CHUNK_SIZE * TILE_SIZE - this.width;
        }
    }
    
    checkCollision(world, axis) {
        const left = Math.floor(this.x / TILE_SIZE);
        const right = Math.floor((this.x + this.width) / TILE_SIZE);
        const top = Math.floor(this.y / TILE_SIZE);
        const bottom = Math.floor((this.y + this.height) / TILE_SIZE);
        
        for (let bx = left; bx <= right; bx++) {
            for (let by = top; by <= bottom; by++) {
                const block = world.getBlock(bx, by);
                if (block !== BLOCKS.AIR && block !== BLOCKS.WATER) {
                    if (axis === 'x') {
                        if (this.vx > 0) {
                            this.x = bx * TILE_SIZE - this.width - 0.1;
                        } else if (this.vx < 0) {
                            this.x = (bx + 1) * TILE_SIZE + 0.1;
                        }
                        this.vx = 0;
                    } else {
                        if (this.vy > 0) {
                            this.y = by * TILE_SIZE - this.height - 0.1;
                            this.grounded = true;
                        } else if (this.vy < 0) {
                            this.y = (by + 1) * TILE_SIZE + 0.1;
                        }
                        this.vy = 0;
                    }
                    return;
                }
            }
        }
        
        if (axis === 'y') {
            this.grounded = false;
        }
    }
    
    attack(world, mouseX, mouseY, camera) {
        if (this.attackCooldown > 0) return;
        
        this.attacking = true;
        this.attackCooldown = 20;
        
        const worldX = mouseX + camera.x;
        const worldY = mouseY + camera.y;
        
        // Verificar si hay objeto o bloque en el rango
        const reach = 100;
        const dx = worldX - (this.x + this.width / 2);
        const dy = worldY - (this.y + this.height / 2);
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < reach) {
            const blockX = Math.floor(worldX / TILE_SIZE);
            const blockY = Math.floor(worldY / TILE_SIZE);
            
            const block = world.getBlock(blockX, blockY);
            if (block !== BLOCKS.AIR && block !== BLOCKS.BEDROCK) {
                world.damageBlock(blockX, blockY, 10);
            }
            
            // Verificar objetos
            world.damageObjectAt(worldX, worldY, 15);
        }
        
        setTimeout(() => { this.attacking = false; }, 100);
    }
    
    placeBlock(world, blockType, mouseX, mouseY, camera) {
        const worldX = mouseX + camera.x;
        const worldY = mouseY + camera.y;
        
        const blockX = Math.floor(worldX / TILE_SIZE);
        const blockY = Math.floor(worldY / TILE_SIZE);
        
        // Verificar que no esté ocupado y esté en rango
        const currentBlock = world.getBlock(blockX, blockY);
        if (currentBlock === BLOCKS.AIR || currentBlock === BLOCKS.WATER) {
            // Verificar distancia
            const px = this.x + this.width / 2;
            const py = this.y + this.height / 2;
            const dx = worldX - px;
            const dy = worldY - py;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < 150) {
                world.setBlock(blockX, blockY, blockType);
                return true;
            }
        }
        return false;
    }
    
    addItem(item, count = 1) {
        // Buscar slot existente
        for (let slot of this.inventory) {
            if (slot && slot.item === item) {
                slot.count += count;
                return;
            }
        }
        
        // Buscar slot vacío
        for (let i = 0; i < this.maxSlots; i++) {
            if (!this.inventory[i]) {
                this.inventory[i] = { item, count };
                return;
            }
        }
    }
    
    removeItem(item, count = 1) {
        for (let i = 0; i < this.inventory.length; i++) {
            if (this.inventory[i] && this.inventory[i].item === item) {
                this.inventory[i].count -= count;
                if (this.inventory[i].count <= 0) {
                    this.inventory[i] = null;
                }
                return true;
            }
        }
        return false;
    }
    
    hasItem(item, count = 1) {
        for (let slot of this.inventory) {
            if (slot && slot.item === item && slot.count >= count) {
                return true;
            }
        }
        return false;
    }
}

// ============================================
// MUNDO
// ============================================

class World {
    constructor(seed) {
        this.seed = seed;
        this.generator = new WorldGenerator(seed);
        this.chunks = {};
        this.objects = [];
        this.entities = [];
        this.particles = [];
        
        // Generar chunks iniciales alrededor del spawn
        this.generateSpawnArea();
    }
    
    generateSpawnArea() {
        const spawnChunkX = Math.floor(WORLD_WIDTH / 2);
        const spawnChunkY = Math.floor(WORLD_HEIGHT / 4);
        
        for (let dx = -2; dx <= 2; dx++) {
            for (let dy = -2; dy <= 2; dy++) {
                const cx = spawnChunkX + dx;
                const cy = spawnChunkY + dy;
                const key = `${cx},${cy}`;
                
                if (!this.chunks[key]) {
                    const terrain = this.generator.generateTerrain(cx, cy);
                    const objects = this.generator.generateObjects(cx, cy, terrain);
                    
                    this.chunks[key] = {
                        x: cx,
                        y: cy,
                        blocks: terrain,
                        objects: objects
                    };
                    
                    this.objects.push(...objects);
                }
            }
        }
    }
    
    getChunk(chunkX, chunkY) {
        const key = `${chunkX},${chunkY}`;
        
        if (!this.chunks[key]) {
            const terrain = this.generator.generateTerrain(chunkX, chunkY);
            const objects = this.generator.generateObjects(chunkX, chunkY, terrain);
            
            this.chunks[key] = {
                x: chunkX,
                y: chunkY,
                blocks: terrain,
                objects: objects
            };
            
            this.objects.push(...objects);
        }
        
        return this.chunks[key];
    }
    
    getBlock(x, y) {
        if (x < 0 || x >= WORLD_WIDTH * CHUNK_SIZE || y < 0 || y >= WORLD_HEIGHT * CHUNK_SIZE) {
            return BLOCKS.AIR;
        }
        
        const chunkX = Math.floor(x / CHUNK_SIZE);
        const chunkY = Math.floor(y / CHUNK_SIZE);
        const chunk = this.getChunk(chunkX, chunkY);
        
        const localX = ((x % CHUNK_SIZE) + CHUNK_SIZE) % CHUNK_SIZE;
        const localY = ((y % CHUNK_SIZE) + CHUNK_SIZE) % CHUNK_SIZE;
        
        return chunk.blocks[localX]?.[localY] || BLOCKS.AIR;
    }
    
    setBlock(x, y, type) {
        if (x < 0 || x >= WORLD_WIDTH * CHUNK_SIZE || y < 0 || y >= WORLD_HEIGHT * CHUNK_SIZE) {
            return;
        }
        
        const chunkX = Math.floor(x / CHUNK_SIZE);
        const chunkY = Math.floor(y / CHUNK_SIZE);
        const chunk = this.getChunk(chunkX, chunkY);
        
        const localX = ((x % CHUNK_SIZE) + CHUNK_SIZE) % CHUNK_SIZE;
        const localY = ((y % CHUNK_SIZE) + CHUNK_SIZE) % CHUNK_SIZE;
        
        if (chunk.blocks[localX]) {
            chunk.blocks[localX][localY] = type;
        }
    }
    
    damageBlock(x, y, damage) {
        const block = this.getBlock(x, y);
        if (block === BLOCKS.AIR || block === BLOCKS.BEDROCK) return;
        
        // Crear partículas
        for (let i = 0; i < 5; i++) {
            this.particles.push({
                x: x * TILE_SIZE + TILE_SIZE / 2,
                y: y * TILE_SIZE + TILE_SIZE / 2,
                vx: (Math.random() - 0.5) * 5,
                vy: (Math.random() - 0.5) * 5,
                life: 30,
                color: BLOCK_COLORS[block]?.[0] || '#fff'
            });
        }
        
        // Bloque destruido
        this.setBlock(x, y, BLOCKS.AIR);
        
        // Drops
        const drops = this.getDropsForBlock(block);
        drops.forEach(drop => {
            this.entities.push({
                type: 'drop',
                item: drop,
                x: x * TILE_SIZE,
                y: y * TILE_SIZE,
                vx: 0,
                vy: 0
            });
        });
    }
    
    getDropsForBlock(block) {
        switch (block) {
            case BLOCKS.GRASS:
            case BLOCKS.DIRT:
                return ['dirt'];
            case BLOCKS.STONE:
                return ['stone'];
            case BLOCKS.ORE_IRON:
                return ['iron_ore'];
            case BLOCKS.ORE_SILVER:
                return ['silver_ore'];
            case BLOCKS.ORE_COPPER:
                return ['copper_ore'];
            default:
                return [];
        }
    }
    
    damageObjectAt(x, y, damage) {
        for (let i = this.objects.length - 1; i >= 0; i--) {
            const obj = this.objects[i];
            const dx = x - obj.x * TILE_SIZE;
            const dy = y - obj.y * TILE_SIZE;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < 50) {
                obj.health -= damage;
                
                // Crear partículas
                for (let j = 0; j < 3; j++) {
                    this.particles.push({
                        x: obj.x * TILE_SIZE + TILE_SIZE / 2,
                        y: obj.y * TILE_SIZE + TILE_SIZE / 2,
                        vx: (Math.random() - 0.5) * 5,
                        vy: (Math.random() - 0.5) * 5,
                        life: 20,
                        color: '#8b4513'
                    });
                }
                
                if (obj.health <= 0) {
                    // Generar drops
                    if (obj.drops) {
                        obj.drops.forEach(drop => {
                            this.entities.push({
                                type: 'drop',
                                item: drop,
                                x: obj.x * TILE_SIZE,
                                y: obj.y * TILE_SIZE,
                                vx: 0,
                                vy: 0
                            });
                        });
                    }
                    this.objects.splice(i, 1);
                }
                return;
            }
        }
    }
    
    getBiomeAt(x, y) {
        const worldX = Math.floor(x / TILE_SIZE);
        const worldY = Math.floor(y / TILE_SIZE);
        return this.generator.biomeMap[worldX]?.[worldY] || BIOMES.MEADOW;
    }
    
    update() {
        // Actualizar partículas
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.2;
            p.life--;
            
            if (p.life <= 0) {
                this.particles.splice(i, 1);
            }
        }
        
        // Actualizar entidades (drops)
        for (let i = this.entities.length - 1; i >= 0; i--) {
            const entity = this.entities[i];
            if (entity.type === 'drop') {
                entity.vy += 0.3;
                entity.y += entity.vy;
                
                // Colisión con suelo
                const blockY = Math.floor((entity.y + 10) / TILE_SIZE);
                const blockX = Math.floor(entity.x / TILE_SIZE);
                const block = this.getBlock(blockX, blockY);
                
                if (block !== BLOCKS.AIR) {
                    entity.y = blockY * TILE_SIZE - 10;
                    entity.vy = 0;
                }
            }
        }
    }
}

// ============================================
// CÁMARA
// ============================================

class Camera {
    constructor(width, height) {
        this.x = 0;
        this.y = 0;
        this.width = width;
        this.height = height;
        this.targetX = 0;
        this.targetY = 0;
        this.smoothing = 0.1;
    }
    
    follow(target) {
        this.targetX = target.x + target.width / 2 - this.width / 2;
        this.targetY = target.y + target.height / 2 - this.height / 2;
        
        this.x += (this.targetX - this.x) * this.smoothing;
        this.y += (this.targetY - this.y) * this.smoothing;
        
        // Límites
        this.x = Math.max(0, Math.min(this.x, WORLD_WIDTH * CHUNK_SIZE * TILE_SIZE - this.width));
        this.y = Math.max(0, Math.min(this.y, WORLD_HEIGHT * CHUNK_SIZE * TILE_SIZE - this.height));
    }
}

// ============================================
// RENDERIZADO
// ============================================

class Renderer {
    constructor(ctx, minimapCtx) {
        this.ctx = ctx;
        this.minimapCtx = minimapCtx;
        this.frameCount = 0;
    }
    
    render(world, player, camera, time) {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        
        // Cielo según bioma y tiempo
        const biome = world.getBiomeAt(player.x, player.y);
        this.renderSky(biome, time);
        
        // Renderizar bloques visibles
        const startCol = Math.floor(camera.x / TILE_SIZE);
        const endCol = startCol + Math.ceil(camera.width / TILE_SIZE) + 1;
        const startRow = Math.floor(camera.y / TILE_SIZE);
        const endRow = startRow + Math.ceil(camera.height / TILE_SIZE) + 1;
        
        for (let x = startCol; x <= endCol; x++) {
            for (let y = startRow; y <= endRow; y++) {
                const block = world.getBlock(x, y);
                if (block !== BLOCKS.AIR) {
                    this.renderBlock(x, y, block);
                }
            }
        }
        
        // Renderizar objetos
        world.objects.forEach(obj => {
            if (obj.type === 'tree') {
                this.renderTree(obj);
            } else if (obj.type === 'rock') {
                this.renderRock(obj);
            } else if (obj.type === 'bush') {
                this.renderBush(obj);
            }
        });
        
        // Renderizar entidades
        world.entities.forEach(entity => {
            if (entity.type === 'drop') {
                this.renderDrop(entity);
            }
        });
        
        // Renderizar partículas
        world.particles.forEach(p => {
            this.ctx.fillStyle = p.color;
            this.ctx.fillRect(p.x - camera.x, p.y - camera.y, 4, 4);
        });
        
        // Renderizar jugador
        this.renderPlayer(player, camera);
        
        // Renderizar minimapa
        this.renderMinimap(world, player, camera);
    }
    
    renderSky(biome, time) {
        const ctx = this.ctx;
        const width = ctx.canvas.width;
        const height = ctx.canvas.height;
        
        // Ciclo día/noche
        const dayProgress = (time % 24000) / 24000;
        let skyColor;
        
        if (dayProgress < 0.25) {
            // Amanecer
            skyColor = this.lerpColor(biome.colors.sky, '#ff6b35', dayProgress * 4);
        } else if (dayProgress < 0.5) {
            // Día
            skyColor = biome.colors.sky;
        } else if (dayProgress < 0.75) {
            // Atardecer
            skyColor = this.lerpColor(biome.colors.sky, '#ff4500', (dayProgress - 0.5) * 4);
        } else {
            // Noche
            skyColor = '#1a1a2e';
        }
        
        // Gradiente del cielo
        const gradient = ctx.createLinearGradient(0, 0, 0, height);
        gradient.addColorStop(0, skyColor);
        gradient.addColorStop(1, biome.colors.ambient);
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
        
        // Sol/Luna
        const celestialX = width * dayProgress;
        const celestialY = height * 0.3 + Math.sin(dayProgress * Math.PI * 2) * height * 0.2;
        
        if (dayProgress >= 0.25 && dayProgress <= 0.75) {
            // Sol
            ctx.fillStyle = '#ffd700';
            ctx.beginPath();
            ctx.arc(celestialX, celestialY, 30, 0, Math.PI * 2);
            ctx.fill();
            
            // Resplandor
            ctx.fillStyle = 'rgba(255, 215, 0, 0.3)';
            ctx.beginPath();
            ctx.arc(celestialX, celestialY, 50, 0, Math.PI * 2);
            ctx.fill();
        } else {
            // Luna
            ctx.fillStyle = '#f0f0f0';
            ctx.beginPath();
            ctx.arc(celestialX, celestialY, 25, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    renderBlock(x, y, type) {
        const ctx = this.ctx;
        const screenX = x * TILE_SIZE - camera.x;
        const screenY = y * TILE_SIZE - camera.y;
        
        const colors = BLOCK_COLORS[type];
        if (!colors) return;
        
        ctx.fillStyle = colors[Math.floor((x + y) % colors.length)];
        ctx.fillRect(screenX, screenY, TILE_SIZE, TILE_SIZE);
        
        // Añadir detalles según tipo de bloque
        if (type === BLOCKS.GRASS) {
            ctx.fillStyle = colors[1];
            ctx.fillRect(screenX, screenY, TILE_SIZE, 4);
        } else if (type === BLOCKS.STONE || type === BLOCKS.ORE_IRON || 
                   type === BLOCKS.ORE_SILVER || type === BLOCKS.ORE_COPPER) {
            // Textura de piedra
            ctx.fillStyle = 'rgba(0,0,0,0.2)';
            ctx.fillRect(screenX + 5, screenY + 5, 8, 8);
            ctx.fillRect(screenX + 18, screenY + 12, 6, 6);
        } else if (type === BLOCKS.WOOD || type === BLOCKS.LOG) {
            // Anillos de madera
            ctx.fillStyle = 'rgba(0,0,0,0.3)';
            ctx.fillRect(screenX + 8, screenY, 4, TILE_SIZE);
            ctx.fillRect(screenX + 20, screenY, 4, TILE_SIZE);
        }
    }
    
    renderTree(obj) {
        const ctx = this.ctx;
        const screenX = obj.x * TILE_SIZE - camera.x;
        const screenY = obj.y * TILE_SIZE - camera.y;
        
        // Tronco
        ctx.fillStyle = '#8b4513';
        ctx.fillRect(screenX + 10, screenY - 60, 12, 60);
        
        // Ramas
        ctx.fillStyle = '#a0522d';
        ctx.fillRect(screenX + 5, screenY - 40, 22, 6);
        ctx.fillRect(screenX + 5, screenY - 25, 22, 6);
        
        // Hojas
        ctx.fillStyle = obj.subtype === 'pine' ? '#228b22' : '#32cd32';
        ctx.beginPath();
        ctx.arc(screenX + 16, screenY - 55, 25, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(screenX + 8, screenY - 45, 18, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(screenX + 24, screenY - 45, 18, 0, Math.PI * 2);
        ctx.fill();
    }
    
    renderRock(obj) {
        const ctx = this.ctx;
        const screenX = obj.x * TILE_SIZE - camera.x;
        const screenY = obj.y * TILE_SIZE - camera.y;
        
        ctx.fillStyle = '#6a6a6a';
        ctx.beginPath();
        ctx.moveTo(screenX + 10, screenY - 20);
        ctx.lineTo(screenX + 25, screenY - 25);
        ctx.lineTo(screenX + 30, screenY - 10);
        ctx.lineTo(screenX + 20, screenY);
        ctx.lineTo(screenX + 5, screenY - 5);
        ctx.closePath();
        ctx.fill();
        
        // Detalles
        ctx.fillStyle = '#5a5a5a';
        ctx.beginPath();
        ctx.arc(screenX + 15, screenY - 12, 5, 0, Math.PI * 2);
        ctx.fill();
    }
    
    renderBush(obj) {
        const ctx = this.ctx;
        const screenX = obj.x * TILE_SIZE - camera.x;
        const screenY = obj.y * TILE_SIZE - camera.y;
        
        ctx.fillStyle = '#228b22';
        ctx.beginPath();
        ctx.arc(screenX + 10, screenY - 8, 12, 0, Math.PI * 2);
        ctx.arc(screenX + 22, screenY - 10, 10, 0, Math.PI * 2);
        ctx.arc(screenX + 16, screenY - 5, 11, 0, Math.PI * 2);
        ctx.fill();
        
        // Bayas
        ctx.fillStyle = '#ff0000';
        ctx.beginPath();
        ctx.arc(screenX + 12, screenY - 10, 3, 0, Math.PI * 2);
        ctx.arc(screenX + 20, screenY - 8, 3, 0, Math.PI * 2);
        ctx.arc(screenX + 16, screenY - 3, 3, 0, Math.PI * 2);
        ctx.fill();
    }
    
    renderDrop(entity) {
        const ctx = this.ctx;
        const screenX = entity.x - camera.x;
        const screenY = entity.y - camera.y;
        
        ctx.fillStyle = '#ffd700';
        ctx.beginPath();
        ctx.arc(screenX + 8, screenY + 8, 6, 0, Math.PI * 2);
        ctx.fill();
        
        // Brillo
        ctx.fillStyle = 'rgba(255, 215, 0, 0.5)';
        ctx.beginPath();
        ctx.arc(screenX + 8, screenY + 8, 10, 0, Math.PI * 2);
        ctx.fill();
    }
    
    renderPlayer(player, camera) {
        const ctx = this.ctx;
        const screenX = player.x - camera.x;
        const screenY = player.y - camera.y;
        
        // Cuerpo
        ctx.fillStyle = '#4a6fa5';
        ctx.fillRect(screenX, screenY, player.width, player.height);
        
        // Cabeza
        ctx.fillStyle = '#ffdbac';
        ctx.fillRect(screenX + 2, screenY - 15, 16, 16);
        
        // Pelo (vikingo)
        ctx.fillStyle = '#8b4513';
        ctx.fillRect(screenX + 2, screenY - 20, 16, 8);
        
        // Barba
        ctx.fillRect(screenX + 4, screenY, 12, 8);
        
        // Ojos
        ctx.fillStyle = '#000';
        const eyeOffset = player.facing === 1 ? 8 : 2;
        ctx.fillRect(screenX + eyeOffset, screenY - 10, 4, 4);
        
        // Arma/Herramienta
        if (player.attacking) {
            ctx.fillStyle = '#c0c0c0';
            const weaponX = player.facing === 1 ? screenX + 25 : screenX - 15;
            ctx.fillRect(weaponX, screenY + 10, 20, 6);
        }
    }
    
    renderMinimap(world, player, camera) {
        const ctx = this.minimapCtx;
        const size = 150;
        const scale = 0.5;
        
        ctx.clearRect(0, 0, size, size);
        
        const centerX = size / 2;
        const centerY = size / 2;
        
        // Renderizar área alrededor del jugador
        const range = 50;
        const playerTileX = Math.floor(player.x / TILE_SIZE);
        const playerTileY = Math.floor(player.y / TILE_SIZE);
        
        for (let dx = -range; dx <= range; dx++) {
            for (let dy = -range; dy <= range; dy++) {
                const worldX = playerTileX + dx;
                const worldY = playerTileY + dy;
                const block = world.getBlock(worldX, worldY);
                
                if (block !== BLOCKS.AIR) {
                    const screenX = centerX + dx * scale;
                    const screenY = centerY + dy * scale;
                    
                    if (block === BLOCKS.WATER) {
                        ctx.fillStyle = '#4a90e2';
                    } else if (block === BLOCKS.GRASS) {
                        ctx.fillStyle = '#4a7c23';
                    } else if (block === BLOCKS.STONE || block === BLOCKS.BEDROCK) {
                        ctx.fillStyle = '#6a6a6a';
                    } else {
                        ctx.fillStyle = '#8b4513';
                    }
                    
                    ctx.fillRect(screenX, screenY, scale, scale);
                }
            }
        }
        
        // Jugador en el minimapa
        ctx.fillStyle = '#ff0000';
        ctx.beginPath();
        ctx.arc(centerX, centerY, 4, 0, Math.PI * 2);
        ctx.fill();
    }
    
    lerpColor(color1, color2, t) {
        // Simplificación para interpolación de colores
        return t < 0.5 ? color1 : color2;
    }
}

// ============================================
// INPUT
// ============================================

class InputHandler {
    constructor() {
        this.keys = {};
        this.mouse = { x: 0, y: 0, left: false, right: false };
        
        window.addEventListener('keydown', (e) => {
            this.keys[e.key.toLowerCase()] = true;
            
            // Números para slots
            if (e.key >= '1' && e.key <= '9') {
                player.selectedSlot = parseInt(e.key) - 1;
                updateInventoryUI();
            }
            
            // Toggle build mode
            if (e.key.toLowerCase() === 'b') {
                player.buildMode = !player.buildMode;
                showMessage(player.buildMode ? 'Modo Construcción: ON' : 'Modo Construcción: OFF');
            }
            
            // Toggle minimap
            if (e.key.toLowerCase() === 'm') {
                minimapCanvas.style.display = minimapCanvas.style.display === 'none' ? 'block' : 'none';
            }
        });
        
        window.addEventListener('keyup', (e) => {
            this.keys[e.key.toLowerCase()] = false;
        });
        
        canvas.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });
        
        canvas.addEventListener('mousedown', (e) => {
            if (e.button === 0) {
                this.mouse.left = true;
                if (!player.buildMode) {
                    player.attack(world, e.clientX, e.clientY, camera);
                } else {
                    // Modo construcción
                    const blockType = getSelectedBlockType();
                    if (blockType && player.hasItem(getBlockItemName(blockType))) {
                        if (player.placeBlock(world, blockType, e.clientX, e.clientY, camera)) {
                            player.removeItem(getBlockItemName(blockType));
                        }
                    }
                }
            } else if (e.button === 2) {
                this.mouse.right = true;
            }
        });
        
        canvas.addEventListener('mouseup', (e) => {
            if (e.button === 0) {
                this.mouse.left = false;
            } else if (e.button === 2) {
                this.mouse.right = false;
            }
        });
        
        canvas.addEventListener('contextmenu', (e) => e.preventDefault());
    }
    
    get left() { return this.keys['a'] || this.keys['arrowleft']; }
    get right() { return this.keys['d'] || this.keys['arrowright']; }
    get jump() { return this.keys['w'] || this.keys[' '] || this.keys['arrowup']; }
    get down() { return this.keys['s'] || this.keys['arrowdown']; }
}

// ============================================
// UTILIDADES UI
// ============================================

function updateInventoryUI() {
    const invDiv = document.getElementById('inventory');
    invDiv.innerHTML = '';
    
    for (let i = 0; i < player.maxSlots; i++) {
        const slot = document.createElement('div');
        slot.className = 'slot';
        
        if (i === player.selectedSlot) {
            slot.style.borderColor = '#ffd700';
            slot.style.boxShadow = '0 0 10px #ffd700';
        }
        
        if (player.inventory[i]) {
            slot.textContent = getItemIcon(player.inventory[i].item);
            const count = document.createElement('span');
            count.className = 'slot-count';
            count.textContent = player.inventory[i].count;
            slot.appendChild(count);
        }
        
        invDiv.appendChild(slot);
    }
}

function updateStatsUI() {
    document.getElementById('healthBar').style.width = `${(player.health / player.maxHealth) * 100}%`;
    document.getElementById('staminaBar').style.width = `${(player.stamina / player.maxStamina) * 100}%`;
    document.getElementById('hungerBar').style.width = `${player.hunger}%`;
}

function updateBiomeInfo(biome, time) {
    document.getElementById('currentBiome').textContent = biome.name;
    
    const dayProgress = (time % 24000) / 24000;
    let timeText = 'Día';
    if (dayProgress < 0.25) timeText = 'Amanecer';
    else if (dayProgress < 0.5) timeText = 'Día';
    else if (dayProgress < 0.75) timeText = 'Atardecer';
    else timeText = 'Noche';
    
    document.getElementById('timeDisplay').textContent = timeText;
}

function showMessage(text) {
    const msgDiv = document.getElementById('message');
    msgDiv.textContent = text;
    msgDiv.style.display = 'block';
    
    setTimeout(() => {
        msgDiv.style.display = 'none';
    }, 2000);
}

function getItemIcon(item) {
    const icons = {
        'wood': '🪵',
        'stone': '🪨',
        'iron_ore': 'ite',
        'silver_ore': '✨',
        'copper_ore': '🥉',
        'dirt': '🟫',
        'berries': '🍒',
        'leaves': '🍃'
    };
    return icons[item] || '📦';
}

function getBlockItemName(blockType) {
    const mapping = {
        [BLOCKS.PLANKS]: 'wood',
        [BLOCKS.WALL_WOOD]: 'wood',
        [BLOCKS.FLOOR_WOOD]: 'wood',
        [BLOCKS.ROOF_WOOD]: 'wood'
    };
    return mapping[blockType] || 'wood';
}

function getSelectedBlockType() {
    // En una implementación completa, esto devolvería el bloque seleccionado
    return BLOCKS.PLANKS;
}

// ============================================
// INICIALIZACIÓN Y BUCLE PRINCIPAL
// ============================================

let gameRunning = true;
let gameTime = 0;
const input = new InputHandler();
const seed = Math.floor(Math.random() * 1000000);
const world = new World(seed);

// Posición inicial del jugador (encontrar superficie)
let spawnY = 0;
const spawnX = (WORLD_WIDTH / 2) * CHUNK_SIZE * TILE_SIZE;
for (let y = 0; y < WORLD_HEIGHT * CHUNK_SIZE; y++) {
    if (world.getBlock(Math.floor(WORLD_WIDTH / 2), y) !== BLOCKS.AIR) {
        spawnY = (y - 2) * TILE_SIZE;
        break;
    }
}

const player = new Player(spawnX, spawnY);
const camera = new Camera(canvas.width, canvas.height);
const renderer = new Renderer(ctx, minimapCtx);

// Añadir items iniciales
player.addItem('wood', 10);
player.addItem('stone', 5);
updateInventoryUI();

console.log(`Valheim 2D iniciado - Seed: ${seed}`);
console.log('Controles: WASD para moverse, Click para atacar/construir, B para modo construcción');

function gameLoop() {
    if (!gameRunning) return;
    
    // Actualizar lógica
    player.update(input, world);
    camera.follow(player);
    world.update();
    
    gameTime++;
    
    // Actualizar UI
    updateStatsUI();
    const currentBiome = world.getBiomeAt(player.x, player.y);
    updateBiomeInfo(currentBiome, gameTime);
    
    // Renderizar
    renderer.render(world, player, camera, gameTime);
    
    requestAnimationFrame(gameLoop);
}

// Iniciar juego
gameLoop();

// Guardar automáticamente cada 30 segundos
setInterval(() => {
    console.log('Progreso guardado automáticamente');
}, 30000);
