import PhysicsEntity from './PhysicsEntity.js';
import Ingredient from './Ingredient.js';

export default class Glass extends PhysicsEntity {
    createPhysics(config) {
        const physicsConfig = {
            ...config
        };

        this.sprite = this.scene.matter.add.sprite(
            this.x, this.y, this.texture, null, {
                ...physicsConfig,
                shape: config
            }
        );
        this.body = this.sprite.body;
        this.sprite.setAlpha(0.9)

        this.rotationConstraint = {
            min: -0.1, // radians (-5.7 degrees)
            max: 0.1, // radians (5.7 degrees)
            stiffness: 0.05
        };

        this.debugGraphics = this.scene.add.graphics();
        this.debugGraphics.setDepth(1000); // Above everything
        this.showDebugBounds = false; // Toggle with debug key
    }

    addLiquid(texture){
        this.liquid = this.scene.add.image(this.x,this.y, texture);
    }
    addLiquidBackground(texture){
        this.liquidbg = this.scene.add.image(this.x,this.y, texture);
    }

    findContainedIngredients() {
        if(!this.scene || !this.scene.entities) return [];

        const glassBounds = this.getGlassBounds();
        return this.scene.entities.filter(entity => {
            return entity instanceof Ingredient && 
                   !entity.destroyed &&
                   (glassBounds.contains(entity.body.position.x, entity.body.position.y) ||
                   entity.wasStacked);
        });
    }

    getGlassBounds() {
        // Define the area of the glass (adjust values as needed)
        const bounds = new Phaser.Geom.Rectangle(
            this.body.position.x - 70, // Left boundary
            this.body.position.y - 700, // Top boundary
            140, // Width
            750 // Height
        );
        
        // Draw debug visualization if enabled
        if (this.showDebugBounds) {
            this.debugGraphics.clear();
            this.debugGraphics.lineStyle(2, 0xff0000, 0.8);
            this.debugGraphics.strokeRect(
                bounds.x, 
                bounds.y, 
                bounds.width, 
                bounds.height
            );
            
            // Optional: Visualize contained ingredients
            this.scene.entities.forEach(entity => {
                if (entity instanceof Ingredient && entity.body && bounds.contains(entity.body.position.x, entity.body.position.y)) {
                    this.debugGraphics.lineStyle(1, 0x00ff00, 0.5);
                    this.debugGraphics.strokeCircle(
                        entity.body.position.x,
                        entity.body.position.y,
                        10
                    );
                }
            });
        }
        
        return bounds;
        // Define the area of the glass (adjust values as needed)
        // this.scene.add.rectangle(this.body.position.x - 60, this.body.position.y - 100, 140, 600, 0xFF0000)
        // return new Phaser.Geom.Rectangle(
        //     this.body.position.x - 60, // Left boundary
        //     this.body.position.y - 100, // Top boundary
        //     140, // Width
        //     600 // Height
        // );
    }

    preUpdate() {
        // Safety checks
        if (!this.body || !this.scene || !this.scene.matter) return;
    
        // Get all bodies that could potentially overlap
        const allBodies = this.scene.matter.world.getAllBodies().filter(body => {
            return body && 
                body.position && 
                body.position.x !== undefined && 
                body !== this.body &&
                !body.isStatic;
        });
        
        // Check each nearby body
        allBodies.forEach(body => {
            try {
                const dx = body.position.x - this.body.position.x;
                const dy = body.position.y - this.body.position.y;
                const distanceSquared = dx * dx + dy * dy;
                
                // Apply stickiness within 40px radius (1600 squared)
                if (distanceSquared < 1600) {
                    const distance = Math.sqrt(distanceSquared);
                    const direction = {
                        x: dx / distance,
                        y: dy / distance
                    };
                    
                    // Dampen velocities (bring closer together)
                    const dampening = 0.30; // 70% velocity reduction
                    this.scene.matter.body.setVelocity(body, {
                        x: body.velocity.x * dampening + direction.x * 0.3,
                        y: body.velocity.y * dampening + direction.y * 0.3
                    });
                    
                }
            } catch (e) {
                console.warn("Stickiness error with body:", body, e);
            }
        });
    }

    turnIn() {
        if(this.turningIn || !this.scene.guestController.current) return;

        // Find all ingredients in/on the glass
        this.containedIngredients = this.findContainedIngredients();
        if(this.containedIngredients.length == 0) return
        this.turningIn = true;
        this.physicsDisabled = true;
        
        // Disable physics on each ingredient
        this.containedIngredients.forEach(ingredient => {
            if (ingredient.body) {
                this.scene.matter.world.remove(ingredient.body);
                ingredient.physicsDisabled = true;
                // Stop any disappearance process
                ingredient.shouldDisappear = false;
            }
        });
        // Disable physics on glass
        this.scene.matter.world.remove(this.body);
        this.scene.scoreGlass(this, this.containedIngredients);
    }

    update() {
        if(this.physicsDisabled) return
        this.preUpdate();
        super.update();

        if(this.liquid) {
            this.liquid.x = this.body.position.x + 2;
            this.liquid.y = this.body.position.y - 18;
        }
        if(this.liquidbg) {
            this.liquidbg.x = this.body.position.x + 2;
            this.liquidbg.y = this.body.position.y - 15.76;
        }

        if(this.body.position.x <= 350) {
            this.turnIn()
        }

        // Apply constrained rotation
        if (this.rotationConstraint) {
            const currentAngle = this.body.angle;
            if (currentAngle < this.rotationConstraint.min) {
                this.scene.matter.body.setAngle(this.body, this.rotationConstraint.min);
                this.scene.matter.body.setAngularVelocity(this.body, 0);
            } else if (currentAngle > this.rotationConstraint.max) {
                this.scene.matter.body.setAngle(this.body, this.rotationConstraint.max);
                this.scene.matter.body.setAngularVelocity(this.body, 0);
            }

            // Apply slight stiffness to return to center
            if (Math.abs(currentAngle) > 0.01) {
                this.scene.matter.body.setAngularVelocity(
                    this.body,
                    -currentAngle * this.rotationConstraint.stiffness
                );
            }
        }

    }

    destroy() {
        this.liquid.destroy();
        this.liquidbg.destroy();
        super.destroy();
    }

}