import { Scene } from 'phaser';
import EntityFactory from '../factories/EnitityFactory';
import GlassController from '../controllers/GlassController';
import GuestController from '../controllers/GuestController';
import Cocktail from '../entities/Cocktail';
import GameGUI from './GameGUI';

export class Game extends Scene {
    constructor() {
        super('Game');
        this.spawnXRange = { min: 460, max: 960 }; // Spawn within these x coordinates
        this.worldBounds = { width: 1280, height: 720 };
        this.highScore = 0
    }

    create() {
        console.log("The bar opens.");
        this.entities = [];
        this.scoredCocktails = [];
        this.spawnInterval = 2500; // 2 seconds between spawns
        this.spawnTimer = 0;
        this.guestInterval = 16;
        this.guestTimeRange = {min: 12, max: 16};
        this.waitingGuest = 0;
        this.spawning = true;
        this.events.once('shutdown', this.shutDownListener, this);
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
        this.music = this.sound.add('jazz', {loop:true});
        this.music.play();
        this.cameras.main.setBackgroundColor(0x444444);
        this.layers.background.add(this.add.image(this.worldBounds.width / 2, this.worldBounds.height /2, 'barBack'));
        this.spawnGuest();
        this.spawnGuest();
        this.spawnGuest();
        this.layers.bar.add(this.add.image(this.worldBounds.width / 2, this.worldBounds.height /2, 'barMid'));
        this.layers.bar.add(this.add.image(343.7,650,'dripmat'));       

        // Create a platform at the bottom
        this.createBottomPlatform();
        
        // Load physics data
        this.factory.setSpritePhysics(this.cache.json.get("spritesPhysics"));
        
        // Create initial glass
        this.glassController = new GlassController(this);
        this.newGlass();
        
        // Start spawn timer
        this.spawnTimer = this.time.now;

        // Create GUI
        this.gui = new GameGUI(this);
        
        this.gui.setObjective("Press and hold left mouse button to move the glass!");
        this.gui.showFloatingMessage("Click and drag!", "#F7AD45");

        this.time.addEvent({
            delay: 1000,
            callback: () => {
                this.guestInterval--
                this.gui.updateTimer(this.guestInterval);
                if (this.guestInterval <= 0) {
                    this.spawnGuest();
                    if(this.guestTimeRange.min > 1) this.guestTimeRange.min--
                    if(this.guestTimeRange.max > this.guestTimeRange.min + 3) this.guestTimeRange.max--
                    this.guestInterval = Phaser.Math.RND.integerInRange(this.guestTimeRange.min, this.guestTimeRange.max);
                }
            },
            loop: true
        });
        

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
        console.log("Left too many guests waiting:", this.guestController.queue)
        this.scene.start('GameOver', {score: this.gui.score});
    }

    scoreGlass(glass, ingredients) {
        this.spawning = false;
        this.glassController.removeGlass();
        this.gui.setObjective("Stack as high as possible for maximum Profit!");
        
        const cocktail = new Cocktail(this, glass.sprite.x, glass.sprite.y);
        cocktail.mix(glass, ingredients);

        // Find the guest who should receive this drink
        const receivingGuest = this.guestController.current;
        
        if (receivingGuest) {
            // Animate the container to the guest
            this.guestController.serveDrink(cocktail);    
        }
        glass.destroy();
        ingredients.forEach((ingredient) => ingredient.destroy());

        if(this.gui.score == 0) this.gui.showFloatingMessage("Good job! Stack higher to earn more!", "#F7AD45");

        this.scoredCocktails.push(cocktail);
        this.gui.updateScore(cocktail.price);
        this.gui.showFloatingMessage(`+ ${cocktail.price}$`, (cocktail.price > 0) ? "#337357" : "#EE4266", -310, 0, '32px Arial');
        this.sound.play('kaching');

        
        
        this.waitingGuest = this.time.now + 800;
        
    }

    newGlass() {
        const glass = this.factory.createGlass(983, 585);
        glass.addLiquid('liquid');
        glass.addLiquidBackground('liquidbg');
        this.glassController.addGlass(glass);
        this.entities.push(glass);
        this.layers.game.add(glass.sprite);

        this.layers.foreground.add(glass.liquid);
        this.layers.midground.add(glass.liquidbg);
        this.spawning = true;
    }

    spawnGuest() {
        this.guestController.addGuest(this.factory.createRandomGuest());
    }

    update(time) {
        // Update all entities
        this.entities.forEach((entity) => entity.update());
        
        // Spawn new ingredients at intervals
        if (time > this.spawnTimer && this.spawning) {
            this.spawnRandomIngredient(3);
            this.spawnTimer = time + this.spawnInterval;
        }

        if (time > this.guestTimer) {
            
            this.guestTimer = time + this.guestInterval;
        }

        if(this.waitingGuest > 0 && time > this.waitingGuest) {
            this.guestController.nextGuest();
            this.newGlass();
            this.waitingGuest = 0;
        }
    }
    
    spawnRandomIngredient(times) {
        const x = Phaser.Math.Between(this.spawnXRange.min, this.spawnXRange.max);
        let deviation = 0;
        while (times > 0) {
            times-=1;
            // Random x position within range
            if(x+deviation < this.spawnXRange.min && x+deviation > this.spawnXRange.max) continue
        
            // Create ingredient just above top of screen
            const ingredient = this.factory.createRandomIngredient(x + deviation, -50);
            
            // Add to tracking array
            this.entities.push(ingredient);
            this.layers.game.add(ingredient.sprite);

            deviation += 200;
        }
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

    removeEntity(ent) {
        this.entities = this.entities.filter((entity) => entity != ent);
        console.log(this.entities)
    }

    shutDownListener() {
        this.entities.forEach((entity) => entity.destroy())
        this.entities = null;
        this.music.stop();
    }
}