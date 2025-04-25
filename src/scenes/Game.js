import { Scene } from 'phaser';
import EntityFactory from '../factories/EnitityFactory';
import GlassController from '../controllers/GlassController';
import GuestController from '../controllers/GuestController';

export class Game extends Scene {
    constructor() {
        super('Game');
        this.entities = [];
        this.scoredCocktails = [];
        this.spawnInterval = 2500; // 2 seconds between spawns
        this.spawnTimer = 0;
        this.guestInterval = 10000;
        this.guestTimer = 0;
        this.spawning = true;
        this.spawnXRange = { min: 500, max: 1000 }; // Spawn within these x coordinates
        this.worldBounds = { width: 1280, height: 720 };
    }

    create() {
        console.log("The bar opens.");
        this.factory = new EntityFactory(this);
        this.layers = {
            background: this.add.layer(),
            guests: this.add.layer(),
            midground: this.add.layer(),
            bar: this.add.layer(),
            game: this.add.layer(),
            foreground: this.add.layer()
        };
        this.guestController = new GuestController(this);
        this.matter.config = {
            // Better handling for rotated bodies
            positionIterations: 10,
            velocityIterations: 8,
            constraintIterations: 6
        };
        this.matter.world.setBounds(
            0, // x
            0, // y 
            this.worldBounds.width, // width
            this.worldBounds.height, // height
            30, // thickness
            true, // left wall
            true, // right wall
            false, // top wall (disabled)
            false  // bottom wall
        );
        this.cameras.main.setBackgroundColor(0x444444);
        this.layers.background.add(this.add.image(this.worldBounds.width / 2, this.worldBounds.height /2, 'barBack'));
        this.spawnGuest();
        this.spawnGuest();
        this.layers.bar.add(this.add.image(this.worldBounds.width / 2, this.worldBounds.height /2, 'barMid'));       

        // Create a platform at the bottom
        this.createBottomPlatform();
        
        // Load physics data
        this.factory.setSpritePhysics(this.cache.json.get("spritesPhysics"));
        
        // Create initial glass
        const glass = this.factory.createGlass(983, 585);
        glass.addLiquid('liquid');
        glass.addLiquidBackground('liquidbg');
        this.glassController = new GlassController(this, glass);
        this.entities.push(glass);
        this.layers.game.add(glass.sprite);
        
        this.layers.foreground.add(glass.liquid);
        this.layers.midground.add(glass.liquidbg);
        
        // Start spawn timer
        this.spawnTimer = this.time.now;

        // Collision Ingredient > Bottomplattform
        this.matter.world.on('collisionstart', (event) => {
            event.pairs.forEach(pair => {
                // Check if either body is the bottom platform
                const platformBody = [pair.bodyA, pair.bodyB].find(
                    body => body === this.bottomPlatform
                );
                if (!platformBody) return;
                // Find the other body (the ingredient)
                const otherBody = pair.bodyA === platformBody ? pair.bodyB : pair.bodyA;
                // Find matching entity in our tracking array
                const ingredientEntity = this.entities.find(entity => 
                    entity.label === "Ingredient" && entity.body === otherBody.gameObject.body
                );
                
                if (ingredientEntity && ingredientEntity.beginDisappear) {
                    ingredientEntity.beginDisappear();
                }
            
            });
        });
    }

    gameOver() {
        console.log("Left to many guests waiting:", this.guestController.queue)
        this.scene.start('GameOver');
    }

    scoreGlass(glass) {
        this.spawning = false;
        this.glassController.removeGlass();
    }

    spawnGuest() {
        this.guestController.addGuest(this.factory.createRandomGuest());
    }

    update(time) {
        // Update all entities
        this.entities.forEach((entity) => entity.update());
        
        // Spawn new ingredients at intervals
        if (time > this.spawnTimer && this.spawning) {
            this.spawnRandomIngredient();
            this.spawnTimer = time + this.spawnInterval;
        }

        if (time > this.guestTimer) {
            this.spawnGuest();
            this.guestTimer = time + Phaser.Math.RND.integerInRange(7000,25000);
        }
    }
    
    spawnRandomIngredient() {
        // Random x position within range
        const x = Phaser.Math.Between(this.spawnXRange.min, this.spawnXRange.max);
        
        // Create ingredient just above top of screen
        const ingredient = this.factory.createRandomIngredient(x, -50);
        
        // Give it some initial random horizontal velocity
        ingredient.body.velocity.x = Phaser.Math.FloatBetween(-10, 10);
        
        // Add to tracking array
        this.entities.push(ingredient);
        this.layers.game.add(ingredient.sprite);
        
    }

    createBottomPlatform() {
        // Create an invisible platform at the bottom
        this.bottomPlatform = this.matter.add.rectangle(
            this.worldBounds.width / 2,
            this.worldBounds.height - 20, // Just below visible area
            this.worldBounds.width,
            100,
            {
                isStatic: true,
                render: { visible: false },
                restitution: 0.2,
                friction: 0
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