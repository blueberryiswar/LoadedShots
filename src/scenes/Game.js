import { Scene } from 'phaser';
import EntityFactory from '../factories/EnitityFactory';

export class Game extends Scene {
    constructor() {
        super('Game');
        this.entities = [];
        this.spawnInterval = 2000; // 2 seconds between spawns
        this.spawnTimer = 0;
        this.spawnXRange = { min: 500, max: 1000 }; // Spawn within these x coordinates
        this.worldBounds = { width: 1280, height: 720 };
    }

    create() {
        this.factory = new EntityFactory(this);
        this.cameras.main.setBackgroundColor(0x444444);
        

        // Create a platform at the bottom
        this.createBottomPlatform();
        
        // Load physics data
        this.factory.setSpritePhysics(this.cache.json.get("spritesPhysics"));
        
        // Create initial glass
        const glass = this.factory.createGlass(400, 600);
        this.entities.push(glass);
        
        // Start spawn timer
        this.spawnTimer = this.time.now;
    }

    update(time) {
        // Update all entities
        this.entities.forEach((entity) => entity.update());
        
        // Spawn new ingredients at intervals
        if (time > this.spawnTimer) {
            this.spawnRandomIngredient();
            this.spawnTimer = time + this.spawnInterval;
        }
    }
    
    spawnRandomIngredient() {
        // Random x position within range
        const x = Phaser.Math.Between(this.spawnXRange.min, this.spawnXRange.max);
        
        // Create ingredient just above top of screen
        const ingredient = this.factory.createRandomIngredient(x, -50);
        
        // Give it some initial random horizontal velocity
        ingredient.body.velocity.x = Phaser.Math.FloatBetween(-1, 1);
        
        // Add to tracking array
        this.entities.push(ingredient);
        
    }

    createBottomPlatform() {
        // Create an invisible platform at the bottom
        this.bottomPlatform = this.matter.add.rectangle(
            this.worldBounds.width / 2,
            this.worldBounds.height + 50, // Just below visible area
            this.worldBounds.width,
            100,
            {
                isStatic: true,
                render: { visible: false }
            }
        );
    }

    checkOutOfBounds() {
        // Clean up fallen ingredients
        this.entities.forEach((entity, index) => {
            if (entity.body && entity.body.position.y > this.worldBounds.height + 100) {
                entity.destroy();
                this.entities.splice(index, 1);
            }
        });
    }
}